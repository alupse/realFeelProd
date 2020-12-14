/*eslint-disable*/
console.log('Hello from the client side');
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoiYWx1cHNlIiwiYSI6ImNraW14amFxczB4bjYyem13ZTkxZmhxbWYifQ.smSSm3PrFcojcbHfhFTdNA';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/alupse/ckimxuqvf366817nr0n1jli2h',
  //   center: [-117.984051, 33.994962],
  //   zoom: 6,
});

const bounds = new mapboxgl.LngLatBounds();

//Create marker
locations.forEach((loc) => {
  //Add marker
  const el = document.createElement('div');
  el.className = 'marker';

  //Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
    zoom: false,
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  new mapboxgl.Popup({
    offset: 30,
    closeOnClick: false,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  //Extend map bounds to include current location
  bounds.extend(loc.coordinates);
});

//Add a popup

map.fitBounds(bounds, {
  padding: { top: 200, bottom: 150, left: 100, right: 100 },
});
