import $ from 'jquery';
const React = require('react');
const ReactDOM = require('react-dom');
const App = require('./App.js').default;
import axios from 'axios';

$(document).ready(() => {

  axios.get("/spa"+window.location.pathname)
  .then(res => {
    window.store = res.data;
    ReactDOM.render(
      <App/>,
      document.getElementById("root")
    )
  })
})
