import $ from 'jquery';
const React = require('react');
const ReactDOM = require('react-dom');
const App = require('./App.js').default;
import axios from 'axios';
import {Provider} from "./store";

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"

window.store = {};

$(document).ready(() => {
  ReactDOM.render(
    <Provider>
      <App/>
    </Provider>,
    document.getElementById("root")
  )
})
