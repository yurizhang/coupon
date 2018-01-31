import 'babel-polyfill';
import Vue from 'vue'
import App from './App.1'

import './reset.css'

import { Button, Field, CellGroup, Popup, Panel } from 'vant';  //Field文本框 
// Vue.component(Button.name, Button);
// Vue.component(Field.name, Field);
// Vue.component(Popup.name, Popup);
// Vue.component(CellGroup.name, CellGroup);

Vue.use(Button);
Vue.use(Field);
Vue.use(Popup);
Vue.use(CellGroup);
Vue.use(Panel );


new Vue({
  el: '#app',
  template: '<App/>',  //<App/>
  components: { App}
})
