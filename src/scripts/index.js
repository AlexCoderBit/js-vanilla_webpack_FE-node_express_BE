import getData from './api/getData';
import createSlider from './components/slider';
import './../styles/main.scss';
require('./../index.pug');

// wait till DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  getData('products')
    .then(json => createSlider(json.data))
    .catch(e => console.error('Failed', e));
});
