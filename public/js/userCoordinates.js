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
    let url2 = `http://127.0.0.1:3000/api/v1/tours/tours-within/400/center/${lt},${lg}/unit/mi`;

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
    // console.log(res.data);
    // const data = res.data;

    // //Promise.all(res1, res2);
    // if (res.data.status === 'success') {
    //   //   res.send(res);
    //   window.setTimeout(
    //     () => {
    //       location.assign('/toursNearMe');
    //     },
    //     1500,
    //     res.data
    //   );
    // }
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
