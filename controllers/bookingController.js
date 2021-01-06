const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const Email = require('../utils/email');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //Get currently booked tour session
  const tour = await Tour.findById(req.params.tourId);

  //create checkout getCheckoutSession
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}&alert=booking`,
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
  const userFound = await User.findById(user);
  if (!tour || !user || !price) {
    return next();
  }
  const book = await Booking.create({ tour, user, price });
  await new Email(userFound, `bla/api/v1/users/bla`).sendBookingConfirmation();
  res.redirect(`${req.protocol}://${req.get('host')}/`);
});

// const createBookingCheckout = async (session) => {
//   const tour = session.client_reference_id;
//   const user = (await User.findOne({ email: session.customer_email })).id;
//   const price = session.amount_total / 100;
//   await Booking.create({ tour, user, price });
// };

//Stripe will call whit webhook whenever a payment was succeeded
// exports.webhookCheckout = catchAsync(async (req, res, next) => {
//   const signature = req.headers['stripe-signature'];
//   let event;
//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       signature,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     return res.status(400).send(`WEBHOOK ERROR : ${err.message}`);
//   }
//   if (event.type === 'checkout.session.completed')
//     createBookingCheckout(event.data.object);

//   res.status(200).json({
//     recieved: true,
//   });
// });

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
