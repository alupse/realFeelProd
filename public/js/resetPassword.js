/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';

export const resetPassword = async (password, passwordConfirm) => {
  const tokenVal = document.getElementById('token').textContent;
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:3000/api/v1/users/resetPassword/${tokenVal}`,
      data: {
        password: password,
        passwordConfirm: passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Password was succesfully reset.');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log(err.response);
    showAlert(
      'error',
      'Something went wrong. Please make sure your passwords match'
    );
  }
};
