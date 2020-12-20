const Tour = require('../models/tourModel');
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
