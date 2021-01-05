import axios from 'axios';
import { showAlert } from './alerts';

export const getCoordinatesBOTH = async () => {
  try {
    let url1 = 'https://ipinfo.io/?token=ba6a2b18cbb69f';

    const res1 = await axios({
      method: 'GET',
      url: url1,
    });
    // api / v1 / tours / tours - within / 400 / center / 33.994962,
    //   -117.984051 / unit / mi;

    const lt = res1.data.loc.split(',')[0];
    const lg = res1.data.loc.split(',')[1];
    let url2 = `/api/v1/tours/tours-within/400/center/${lt},${lg}/unit/mi`;

    const res = await axios({
      method: 'GET',
      url: url2,
    }).then((response) =>
      window.setTimeout(
        (response) => {
          location.assign('/toursNearMe');
        },
        1500,
        response.data
      )
    );
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
