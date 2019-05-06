import {isSetUser, User} from '@/store/user';
import {reference} from '@/firebase/base';
import {dashboardUserInvitationPath, dashboardUserInvitationsReference} from '@/firebase/dashboard';
import {userDashboardInvitationPath, userDashboardInvitationsReference} from '@/firebase/user';
import {cleanUpdates, getChangeListener, listenOnUpdates} from '@/store/storeUtils';
import {isSetDashboard} from '@/store/dashboard';

export const invitationsPlugin = store => {
    const userListener = getChangeListener(
        isSetUser,
        user => cleanUserInvitationsState(store, user.id),
        user => listenForNewUserInvitationsUpdates(store, user.id)
    );
    const dashboardListenerDashboardListener = getChangeListener(
        isSetDashboard,
        user => cleanDashboardInvitationsState(store, user.id),
        user => listenForNewDashboardInvitationsUpdates(store, user.id)
    );
    store.subscribe(({type, payload}) => {
        userListener(type, payload);
        dashboardListenerDashboardListener(type, payload);
    });
};

export const userInvitationsStore = {
    state: {
        dashboardInvitedUsers: {},
        userDashboardInvitations: {},
    },
    getters: {
        dashboardInvitedUsers: state => state.dashboardInvitedUsers,
        userDashboardInvitations: state => state.userDashboardInvitations
    },
    mutations: {
        setDashboardInvitedUsers(state, payload) {
            state.dashboardInvitedUsers = payload;
        },
        clearDashboardInvitedUsers(state) {
            state.dashboardInvitedUsers = {};
        },
        setUserDashboardInvitations(state, payload) {
            state.userDashboardInvitations = payload;
        },
        clearUserDashboardInvitations(state) {
            state.userDashboardInvitations = {};
        },
    },
    actions: {
        sendDashboardInvitation({commit}, {user, dashboardId}: DashboardInvitation) {
            return updateDashboardInvitation(commit, user, dashboardId, true);
        },
        sendDashboardInvitationCancellation({commit}, {user, dashboardId}: DashboardInvitation) {
            return updateDashboardInvitation(commit, user, dashboardId, false);
        }
    }
};

function updateDashboardInvitation(commit, user: User, dashboardId: string, isInvitation: boolean) {
    const updates = {};
    const {id, ...userData} = user;
    const value = isInvitation ? userData : null;
    updates[userDashboardInvitationPath(id, dashboardId)] = value;
    updates[dashboardUserInvitationPath(dashboardId, id)] = value;
    return reference().update(updates).catch(e => {
        commit('setError', e);
    });
}

function cleanUserInvitationsState({commit}, userId: string) {
    cleanUpdates(commit, userDashboardInvitationsReference(userId), 'clearUserDashboardInvitations');
}

function listenForNewUserInvitationsUpdates({commit}, userId: string) {
    listenOnUpdates(commit, userDashboardInvitationsReference(userId), 'setUserDashboardInvitations');
}

function cleanDashboardInvitationsState({commit}, userId: string) {
    cleanUpdates(commit, dashboardUserInvitationsReference(userId), 'clearDashboardInvitedUsers');
}

function listenForNewDashboardInvitationsUpdates({commit}, userId: string) {
    listenOnUpdates(commit, dashboardUserInvitationsReference(userId), 'setDashboardInvitedUsers');
}

export interface DashboardInvitation {
    user: User;
    dashboardId: string;
    isInvitation?: boolean;
}
