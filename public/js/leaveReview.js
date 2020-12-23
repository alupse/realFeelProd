/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';

export const leaveReview = async (tourId, reviewRatingValue, reviewText) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/reviews',
      data: {
        tour: tourId,
        rating: reviewRatingValue,
        review: reviewText,
      },
      withCredentials: true,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Reviewed succesfully');
      window.setTimeout(() => {
        location.assign('/me');
      }, 1500);
    }
  } catch (err) {
    console.log(err.response);
    showAlert('error', err.response.data.message);
  }
};
