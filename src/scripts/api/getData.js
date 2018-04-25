import axios from 'axios';
import endPoints from './urls';

export default function(link) {
  const url = endPoints[link];

  return axios
    .get(url)
    .then(function(response) {
      return response;
    })
    .catch(function(ex) {
      console.log('request failed', ex);
    });
}
