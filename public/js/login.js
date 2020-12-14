/*eslint-disable*/

// const login = async (email, password) => {
//   console.log(email, password);
//   try {
//     const res = await axios({
//       method: 'POST',
//       headers: {
//         'content-type': 'application/json',
//       },
//       url: 'http://localhost:3000/api/v1/users/login',
//       data: {
//         email: email,
//         password: password,
//         withCredentials: true,
//       },
//     });
//   } catch (err) {
//     console.log('EROARE');
//   }
// };

const login = async (email, password) => {
  try {
    const res = await axios({
      mehod: 'POST',
      url: '/api/v1/users/login',
      data: {
        email: email,
        password: password,
      },
      withCredentials: true,
    });
    const cookie = res.cookie('jwt', token, cookieOptions);
    console.log(email, password);
    console.log(cookie);
  } catch (err) {
    console.log(err.response);
    alert('error', err.response);
  }
  console.log(res);
};

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
