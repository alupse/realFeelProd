const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const tourController = require('../controllers/tourController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview
);

router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);

router.get('/signup', viewController.getSignupForm);

router.get('/forgotPassword', viewController.getForgotPasswordForm);

router.get('/resetPassword/:token', viewController.getResetPasswordForm);

router.get('/login', authController.isLoggedIn, viewController.getLoginForm);

router.get('/me', authController.protect, viewController.getAccount);

router.get(
  '/my-tours',
  authController.protect,
  authController.isLoggedIn,
  viewController.getMyTours
);
router.get(
  '/toursNearMe',
  authController.protect,
  authController.isLoggedIn,
  viewController.getToursNearMe
);

router.get(
  '/manageUsers',
  authController.protect,
  authController.isLoggedIn,
  viewController.getManageUsers
);
router.get(
  '/manageUsers/:id',
  authController.protect,
  authController.isLoggedIn,
  userController.deleteUser,
  viewController.deleteUsers
);

router.get(
  '/manageTours',
  authController.protect,
  authController.isLoggedIn,
  viewController.getManageTours
);

router.get(
  '/top-5-cheap',
  authController.protect,
  tourController.alliasTopTours,
  viewController.getCheapestTours
);
router.get(
  '/leaveReview',
  authController.protect,
  authController.isLoggedIn,
  viewController.getLeaveReviewForm
);

router.get(
  '/desactivateAccount',
  authController.protect,
  authController.isLoggedIn,
  authController.desactactivateAccount,
  viewController.desactivateAccount
);

module.exports = router;
