import '../scss/main.scss';
import { h, render } from 'preact';
import App from './almanac-app/containers/App';
import groupBy from 'lodash/groupBy';

// root holds our app's root DOM Element:
let root;

function init(data) {
  root = render(<App data={data} />, document.querySelector('#app'), root);
}

const secret = document.querySelector('input#secret').value;

fetch('/api/election-events/?format=json', {
  'AUTHENTICATION': `Token ${secret}`
}).then((response) => {
  return response.json();
}).then((data) => {
  const grouped = groupBy(data, 'election_day.date');
  init(grouped);
});