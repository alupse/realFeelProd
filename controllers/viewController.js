const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1 Get tour data from collection

  const tours = await Tour.find();
  // 2 Build templated tour

  // 3 Render that template using the tour data from 1

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getCheapestTours = catchAsync(async (req, res, next) => {
  // 1 Get tour data from collection
  //tourController.alliasTopTours, tourController.getAllTours
  const lim = parseInt(req.query.limit);
  console.log('INtra aici daa');
  console.log(req.query);
  const tours = await Tour.find().limit(lim).sort(req.query.sort);
  console.log(tours);

  // 2 Build templated tour

  // 3 Render that template using the tour data from 1

  res.status(200).render('overview', {
    title: 'Cheapest Tours',
    tours,
  });
});

exports.getToursNearMe = catchAsync(async (req, res, next, data) => {
  const tours = await Tour.find();

  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "script-src 'self' https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.0/axios.min.js 'unsafe-inline' 'unsafe-eval';"
    )
    .render('overview', {
      title: 'Cheapest Tours',
      tours,
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('tour', {
      title: `${tour.name} Tour`,
      tour,
    });
});

// 1 get the data for the requested tour data from (including reviews and guides)
//  2 Build templated tour
// 3 Render template using the data from step 1

exports.getLoginForm = (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "script-src 'self' https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.0/axios.min.js 'unsafe-inline' 'unsafe-eval';"
    )
    .render('login', {
      title: 'Log into your account',
    });
};

exports.getAccount = (req, res) => {
  console.log('hei');
  res.status(200).render('account', {
    title: 'Your account',
    user: req.user,
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // Find all bookings
  const bookings = await Booking.find({ user: req.user.id });
  //Find tours with the returned ids
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  res.status(200).render('overview', {
    title: 'Your bookings',
    tours,
  });
});

exports.getSignupForm = (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "script-src 'self' https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.0/axios.min.js 'unsafe-inline' 'unsafe-eval';"
    )
    .render('signup', {
      title: 'Create a new account',
    });
};

exports.getForgotPasswordForm = (req, res) => {
  console.log('Am ajuns chiar aici');
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "script-src 'self' https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.0/axios.min.js 'unsafe-inline' 'unsafe-eval';"
    )
    .render('forgotPassword', {
      title: 'Recover your password',
      token: req.params.token,
    });
};

exports.getResetPasswordForm = (req, res) => {
  console.log('Am ajuns chiar aici');
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "script-src 'self' https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.0/axios.min.js 'unsafe-inline' 'unsafe-eval';"
    )
    .render('resetPassword', {
      title: 'Change your password',
      token: req.params.token,
    });
};

exports.getManageUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "script-src 'self' https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.0/axios.min.js 'unsafe-inline' 'unsafe-eval';"
    )
    .render('manageUsers', {
      title: 'Manage users',
      users,
    });
});

exports.deleteUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "script-src 'self' https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.0/axios.min.js 'unsafe-inline' 'unsafe-eval';"
    )
    .render('manageUsers', {
      title: 'Manage users',
      users,
    });
});

exports.getManageTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "script-src 'self' https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.0/axios.min.js 'unsafe-inline' 'unsafe-eval';"
    )
    .render('manageTours', {
      title: 'Manage tours',
      tours,
    });
});

exports.getLeaveReviewForm = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id, reviewed: false });
  //Find tours with the returned ids
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "script-src 'self' https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.0/axios.min.js 'unsafe-inline' 'unsafe-eval';"
    )
    .render('leaveReview', {
      title: 'Review tours you have booked',
      tours,
    });
});

exports.desactivateAccount = (req, res) => {
  res.cookie('jwt', 'LoggedOutUnicorn', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  console.log(req.user);
  req.user = undefined;
  console.log(req.user + 'in faza 2');
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "script-src 'self' https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.0/axios.min.js 'unsafe-inline' 'unsafe-eval';"
    )
    .render('login', {
      title: 'Log into your account',
    });
};
