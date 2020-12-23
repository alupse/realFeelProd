/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';

export const deleteUser = async () => {
  try {
    const userId = document.querySelector('.btn-danger');
    console.log(userId);
    // const res = await axios({
    //   method: 'DELETE',
    //   url: `http://127.0.0.1:3000/api/v1/users/${userId}`,
    //   withCredentials: true,
    // });

    if (res.data.status === 'success') {
      showAlert('success', 'User deleted succesfully');
      window.setTimeout(() => {
        location.assign('/manageusers');
      }, 1500);
    }
  } catch (err) {
    console.log(err.response);
    showAlert('error', err.response.data.message);
  }
};

// export const logout = async () => {
//   try {
//     const res = await axios({
//       method: 'GET',
//       url: 'http://127.0.0.1:3000/api/v1/users/logout',
//     });

//     if ((res.data.status = 'success'))
//       window.location.replace('http:///127.0.0.1:3000/');
//   } catch (err) {
//     showAlert('error', 'Error logging out! Try again.');
//   }
// };
