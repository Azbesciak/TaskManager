import Vue from 'vue';
import Vuex from 'vuex';
import {userStore, userStorePlugin} from '@/store/user';
import {sharedStore} from '@/store/shared';
import {dashboardPlugins, dashboardStore} from '@/store/dashboard';
import {tasksStore} from '@/store/dashboard-tasks';
import {invitationsPlugin, userInvitationsStore} from '@/store/user/invitations';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        userStore, sharedStore, dashboardStore, tasksStore, userInvitationsStore
    }, plugins: [dashboardPlugins, userStorePlugin, invitationsPlugin]
});
