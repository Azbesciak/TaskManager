import Vue from 'vue';
import Vuex from 'vuex';
import {userStore} from '@/store/user';
import {sharedStore} from '@/store/shared';
import {dashboardStore} from '@/store/dashboard';
import {tasksStore} from '@/store/dashboard-tasks';
import {userSearchStore, userStorePlugins} from '@/store/user-search';
import {userInvitationsStore} from '@/store/user/invitations';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        userStore, sharedStore, dashboardStore, tasksStore, userSearchStore, userInvitationsStore
    }, plugins: userStorePlugins,
});
