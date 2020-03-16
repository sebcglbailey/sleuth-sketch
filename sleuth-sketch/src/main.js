import Vue from 'vue';
import icons from '@/shared/icons';
import 'appstyles/main.scss';
import App from './App';

icons.setup();

if (process.env.NODE_ENV === 'development') {
    Vue.config.devtools = true;
    Vue.config.debug = true;
    Vue.config.productionTip = false;
}

new Vue({
    render: (h) => h(App),
}).$mount('#app');
