const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const appError = require('../utils/appError');
const Email = require('../utils/email');
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
// const desactiv =(id) =>{
//   const user = await User.findById(id);
//    await user.desactivate();
// }

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    //converted it to miliseconds ; httpOnly prevetnts cross sites scripting attacks; secure to use only https(cant manipulate cookie in browser)
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (!process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  //remove the password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
exports.signUp = catchAsync(async (req, res, next) => {
  //if we send req.body, anyone can specify the role as an admin -- security issue
  const newUser = await User.create(req.body);
  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(newUser, url).sendWelcome();

  createAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1 Check if email and pass exists
  if (!email || !password) {
    return next(new appError('Please provide email and password!', 400));
  }

  // 2 Check if the user exists && password is correct
  //By default password is not selected, but using .select(+password) we explicitly selected

  const user = await User.findOne({ email }).select('+password');
  if (
    !user ||
    !(await user.correctPassword(password, user.password)) ||
    user.active === false
  ) {
    return next(new appError('Incorrect email or password', 401));
  }
  if (user.active === false) {
    const activatedUser = await User.updateOne({ active: true });
    alert('Account was reactivated');
    createAndSendToken(activatedUser, 200, res);
  } else {
    createAndSendToken(user, 200, res);
  }

  // 3 If everything is ok, send token to client
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'LoggedOutUnicorn', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  //1 Getting the token and check if its there

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new appError('You are not logged in! Please log in to get access', 401)
    );
  }
  //2 Verification the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3  Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new appError('The user belonging to this token no longer exist', 401)
    );
  }

  //4 Check if user changed password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new appError('User recently changed password! Please log in again', 401)
    );
  }
  //grant access to the protected route
  req.user = currentUser;

  next();
});

//(...roles) creates an array of all the specified args
// created a wrapper function around the middlewear so that the roles can be specified
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // in the protect midddlewear we stored the current user in req.user
    if (!roles.includes(req.user.role)) {
      return next(
        new appError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1 Get user based on POSTed email address
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    next(new appError('There is no user having this email address', 404));
  }

  //2 Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3 Send it to user`s email

  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email !!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new appError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1 Get user based on the token

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2 if token !expired and there is a user -> set new password
  if (!user) {
    return next(new appError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  //3 Update changedPasswordAt prop for the users

  //4 Log the user in , send JWT

  createAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1 Get user from the collection

  const user = await User.findById(req.user.id).select('+password');

  //2 Check if posted password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new appError('Your current password is wrong', 401));
  }

  // 3 If so, update the password

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  createAndSendToken(user, 200, res);

  // 4 Log in , send JWT
});

//Only for renedered pages, no errors !
exports.isLoggedIn = async (req, res, next) => {
  //verify token
  try {
    if (req.cookies.jwt) {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      //check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // Check if user changed password after token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      //There is a logged in user
      res.locals.user = currentUser;
      return next();
    }
  } catch (err) {
    return next();
  }
  next();
  //2 Verification the token
};

exports.desactactivateAccount = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  await user.desactivate();
  await User.findByIdAndUpdate(req.user.id, user);

  next();
});

exports.updateUserRole = catchAsync(async (req, res, next) => {
  const { id, role } = req.params;
  var updatedRole = '';
  if (role === 'user') {
    updatedRole = 'guide';
  } else {
    updatedRole = 'user';
  }
  const updateData = { role: `${updatedRole}` };

  const user = await User.findByIdAndUpdate(id, updateData);

  next();
});
