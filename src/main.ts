import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import {router} from './router';
import store from './store/store';
import './registerServiceWorker';
import firebase from 'firebase';
import ErrorAlert from './components/ErrorAlert.vue';

Vue.component('error-alert', ErrorAlert);
Vue.config.productionTip = false;

const config = {
    apiKey: 'AIzaSyCIH8m8UuCgkzJwp5S6J8P4CIl2k6reXfw',
    authDomain: 'task-manager-235704.firebaseapp.com',
    databaseURL: 'https://task-manager-235704.firebaseio.com',
    projectId: 'task-manager-235704',
    storageBucket: 'task-manager-235704.appspot.com',
    messagingSenderId: '641099891992',
};
new Vue({
    router,
    store,
    render: (h) => h(App),
    created() {
        firebase.initializeApp(config);
        firebase.auth().onAuthStateChanged((user) => {
            store.dispatch('autoSignIn', user);
        });
    }
}).$mount('#app');
