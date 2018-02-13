import '../scss/main.scss';
import React from 'react';
import { render } from 'react-dom';
import App from './almanac-app/containers/App';
import groupBy from 'lodash/groupBy';

require('preact/devtools');

// root holds our app's root DOM Element:
let root;

function init(data) {
  root = render(<App data={data} />, document.querySelector('#app'), root);
}

const secretInput = document.querySelector('input#secret')

let headers = {};
if (secretInput) {
  const secret = secretInput.value;
  headers['AUTHENTICATION'] = `Token ${secret}`;
}

fetch(window.appConfig.data, headers).then((response) => {
  return response.json();
}).then((data) => {
  const grouped = groupBy(data, 'election_day.date');
  init(grouped);
});