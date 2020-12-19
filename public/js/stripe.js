/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  try {
    const stripe = Stripe(
      'pk_test_51I037CFnYMW0JMwSrRQ7KjWPshTh6Gdm7vrby0P0Si7ZE09w9a3RTDIXqbwzPGkHpWgaJGHejrK0EhEUfUMI57A100eKCUyQKs'
    );
    //1 Get checkout session from API

    const session = await axios(
      `http://127.0.0.1:3000/api/v1/booking/checkout-session/${tourId}`
    );
    console.log(session);

    //2 Create checkout form +charge the credit card.
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
