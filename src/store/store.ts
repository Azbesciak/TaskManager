import Vue from 'vue';
import Vuex from 'vuex';
import {userStore} from '@/store/user';
import {sharedStore} from '@/store/shared';
import {dashboardStore} from '@/store/dashboard';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        userStore, sharedStore, dashboardStore
    }
});
