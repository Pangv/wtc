import Vue from 'vue'
import App from './App.vue'

import 'jquery';
import 'bootstrap';
import _ from 'underscore';
import * as moment from 'moment';
import 'moment/locale/de';

new Vue({
  el: '#app',
  render: h => h(App)
})
