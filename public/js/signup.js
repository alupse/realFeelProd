/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name: name,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm,
      },
      withCredentials: true,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Signed up in succesfully, Please Check your email');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log(err.response);
    showAlert('error', err.response.data.message);
  }
};
