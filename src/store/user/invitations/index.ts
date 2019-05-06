import {isSetUser, User} from '@/store/user';
import {reference} from '@/firebase/base';
import {dashboardUserInvitationPath, dashboardUserInvitationsReference, dashboardUserPath} from '@/firebase/dashboard';
import {
    userDashboardInvitationPath,
    userDashboardInvitationsReference,
    userDashboardPath,
} from '@/firebase/user';
import {cleanUpdates, getChangeListener, listenOnUpdates} from '@/store/storeUtils';
import {getDashboardName, isSetDashboard} from '@/store/dashboard';

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
        dashboardInvitedUsers: [],
        userDashboardInvitations: [],
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
            state.dashboardInvitedUsers = [];
        },
        setUserDashboardInvitations(state, payload) {
            state.userDashboardInvitations = payload;
        },
        clearUserDashboardInvitations(state) {
            state.userDashboardInvitations = [];
        },
    },
    actions: {
        sendDashboardInvitation(store, invitation: DashboardInvitation) {
            return updateDashboardInvitation(store, invitation, true);
        },
        sendDashboardInvitationCancellation(store, invitation: DashboardInvitation) {
            return updateDashboardInvitation(store, invitation, false);
        },
        acceptDashboardInvitation({commit, getters}, {dashboardId, name}: DashboardHeader) {
            if (!getters.user)
                return;
            const {id, ...user} = getters.user;
            const updates = {};
            addInvitationCancelUpdate(updates, id, dashboardId);
            updates[dashboardUserPath(dashboardId, id)] = user;
            updates[userDashboardPath(id, dashboardId)] = {name};
            return executeUpdate(commit, updates);
        },
        discardDashboardInvitation({commit, getters}, dashboardId: string) {
            if (!getters.user)
                return;
            const {id, ...user} = getters.user;
            const updates = {};
            addInvitationCancelUpdate(updates, id, dashboardId);
            return executeUpdate(commit, updates);
        }
    }
};

export function addInvitationCancelUpdate(updates: any, userId: string, dashboardId: string) {
    updates[userDashboardInvitationPath(userId, dashboardId)] = null;
    updates[dashboardUserInvitationPath(dashboardId, userId)] = null;
}

function updateDashboardInvitation({commit, getters}, {user, dashboardId}: DashboardInvitation, isInvitation: boolean) {
    const updates = {};
    const {id, ...userData} = user;
    if (isInvitation) {
        const {...sender} = getters.user;
        if (!sender) return;
        delete sender.id;
        const name = getDashboardName(getters, dashboardId);
        updates[userDashboardInvitationPath(id, dashboardId)] = {name, sender};
        updates[dashboardUserInvitationPath(dashboardId, id)] = userData;
    } else {
        addInvitationCancelUpdate(updates, id, dashboardId);
    }
    return executeUpdate(commit, updates);
}

function executeUpdate(commit, updates) {
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
export interface DashboardHeader {
    dashboardId: string;
    name: string;
}
