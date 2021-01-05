/*eslint-disable*/

import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login.js';
import { signup } from './signup.js';
import { forgotPassword } from './forgotPassword.js';
import { resetPassword } from './resetPassword.js';
import { deleteUser } from './adminCrud.js';
import { getCoordinatesBOTH } from './userCoordinates.js';
import { updateSettings } from './updateSettings';
import { changeRole } from './changeRole';
import { leaveReview } from './leaveReview';
import { bookTour } from './stripe';

//DOM elements

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const forgotPasswordForm = document.querySelector('.form--forgotPassword');
const resetPasswordForm = document.querySelector('.form--resetPassword');
const token = document.querySelector('.tok');
const logOutBtn = document.querySelector('.nav__el--logout');
const updateDataForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const nearMeBtn = document.getElementById('getToursNearMe');
const usr = document.querySelector('.usr');
const delicn = document.querySelector('.iconDelete');
//const userId = document.getElementById('idUser').value;
const deleteUserBtn = document.getElementById('deleteBtn');
const changeRoleButton = document.getElementById('changeRoleButton');
const leaveReviewForm = document.querySelector('.form--leaveReview');

const createTourForm = document.querySelector('.form--createTour');
console.log(document.getElementById('changeRoleButton') + '----------');
//values
//delegation

if (mapBox) {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );

  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);
if (nearMeBtn) {
  nearMeBtn.addEventListener('click', (e) => {
    console.log('Intru in near me');
    getCoordinatesBOTH().subscribe;
  });
}

if (changeRoleButton) {
  console.log('Macar pana aici suntem');
  changeRoleButton.addEventListener('click', (e) => {
    console.log('Intru in changerole buttone');
    console.log(document.getElementById('changeRoleButton').userRole);
    changeRole(
      document.getElementById('changeRoleButton').userId,
      document.getElementById('changeRoleButton').userRole
    );
  });
}
if (deleteUserBtn)
  deleteUserBtn.addEventListener('click', (e) => {
    //e.preventDefault();
    //   const userIdToDelete = document.getElementById('.id').value;
    //const { user._id} = e.target.dataset;
    //rId = document.getElementById('idUser').value;
    console.log(document.getElementById('deleteBtn').idToDelete);
    console.log('Intru in delete');
    console.log(delicn);

    deleteUser();
  });

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup(name, email, password, passwordConfirm);
  });
}

if (leaveReviewForm) {
  leaveReviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const tourId = document.getElementById('tour').value;
    const reviewRatingValue = document.getElementById('reviewRatingValue')
      .value;
    const reviewText = document.getElementById('reviewText').value;
    console.log(tourId);
    console.log('miau');
    // const password = document.getElementById('password').value;
    //const passwordConfirm = document.getElementById('passwordConfirm').value;
    // signup(name, email, password, passwordConfirm);
    leaveReview(tourId, reviewRatingValue, reviewText);
  });
}

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    forgotPassword(email);
  });
}

if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    resetPassword(password, passwordConfirm);
  });
}

if (updateDataForm) {
  updateDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    // const email = document.getElementById('email').value;
    // const name = document.getElementById('name').value;
    updateSettings(form, 'data');
  });

  if (updatePasswordForm) {
    updatePasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      document.querySelector('.btn--save-password').textContent = 'Updating...';
      const passwordCurrent = document.getElementById('password-current').value;
      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('password-confirm').value;
      await updateSettings(
        { passwordCurrent, password, passwordConfirm },
        'password'
      );
    });
    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  }
}

if (bookBtn)
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
