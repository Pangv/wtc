import Vue from 'vue';
import App from './App.vue';

import 'jquery';
import 'bootstrap';
import * as moment from 'moment';
import 'moment/locale/de';

moment.locale('de');
Object.defineProperty(Vue.prototype, '$moment', {value: moment});

new Vue({
	el: '#app',
	render: h => h(App)
});
