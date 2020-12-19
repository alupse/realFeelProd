const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('./../models/tourModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

console.log('Aici');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //Get currently booked tour session
  const tour = await Tour.findById(req.params.tourId);
  console.log(tour);

  //create checkout getCheckoutSession
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [
              'https://i.insider.com/5952bc22d084cca0008b5ec9?width=1000&format=jpeg&auto=webp',
            ],
          },
        },
      },
    ],
  });

  //create sesion as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  //Temporary cause it is unsecure, everyone can make bookings without paying
  const { tour, user, price } = req.query;
  if (!tour || !user || !price) {
    return next();
  }
  const book = await Booking.create({ tour, user, price });

  res.redirect(`${req.protocol}://${req.get('host')}/`);
});
