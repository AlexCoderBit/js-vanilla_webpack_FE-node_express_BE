// for prod take vars from process.env
const API_URL = 'http://localhost:3000/';

const endPoints = {
  productsList: 'products-list'
};

export default {
  products: `${API_URL}${endPoints.productsList}`
};
