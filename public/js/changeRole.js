/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';
export const changeRole = async (id, currentRole) => {
  const updatedRole;
  if (currentRole === 'guide') {
    updatedRole = 'user';
  } else {
    updatedRole = 'guide';
  }
  try {
    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:3000/api/v1/users/${id}`,
      data: {
        role: updatedRole,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Updated succesfully');
      window.setTimeout(() => {
        location.assign('/manageUsers');
      }, 1500);
    }
  } catch (err) {
    console.log(err.response);
    showAlert('error', err.response.data.message);
  }
};
