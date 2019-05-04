import * as firebase from 'firebase';
import {User, userDashboardInvitation, userReference, USERS_STORE} from '@/store/user';
import {dashboardUserInvitation} from '@/store/dashboard';
import Vue from 'vue';

let _db: firebase.database.Database | null = null;

export const userStorePlugins = [store => {
    store.subscribe(mutations => {
        if (mutations.type === 'setDashboard') {
            store.dispatch('fetchDashboardInvitedUsers', mutations.payload);
        }
    });
}
];

function db() {
    if (!_db) {
        _db = firebase.database();
    }
    return _db;
}

export function queryUser(query: string) {
    return db().ref(USERS_STORE).orderByChild('email')
        .startAt(query)
        .limitToFirst(10)
        .once('value')
        .then(value =>
            Object
                .entries(value.val() || {})
                .map(([k, v]) => Object.assign(v, {id: k}))
        );
}

let id = 0;

export const userSearchStore = {
    state: {
        dashboardInvitedUsers: {},
        usersResultsPromises: {},
        usersResults: {}
    },
    mutations: {
        addUserResult(state, user: User) {
            state.usersResults[user.id] = user;
        },
        addUserResultPromise(state, {userId, promise}) {
            state.usersResults[userId] = promise;
        },
        newDashboardUserInvitations(state) {
            state.dashboardInvitedUsers = {
                invitationsId: ++id,
                users: {}
            };
        },
        materializeUserDashboardInvitation(state, payload: User) {
            const invitations = state.dashboardInvitedUsers;
            if (invitations && invitations.invitationsId === id) {
                Vue.set(invitations.users, payload.id, payload);
            }
        }
    },
    getters: {
        usersResults: state => state.usersResults,
        usersResultsPromises: state => state.usersResultsPromises,
        dashboardInvitedUsers: state => state.dashboardInvitedUsers.users
    },
    actions: {
        sendDashboardInvitation({commit}, {user, dashboardId}: DashboardInvitation) {
            return updateDashboardInvitation(commit, user, dashboardId, true);
        },
        sendDashboardInvitationCancellation({commit}, {user, dashboardId}: DashboardInvitation) {
            return updateDashboardInvitation(commit, user, dashboardId, false);
        },
        fetchDashboardInvitedUsers({getters, commit}, dashboard) {
            const promises = getters.usersResultsPromises;
            const readyUserData = getters.usersResults;
            commit('newDashboardUserInvitations');
            Object.keys(dashboard.invitations || {})
                .forEach(userId => cacheUserData(readyUserData, userId, commit, promises));
        }
    }
};

function cacheUserData(ready, userId, commit, promises) {
    let r = ready[userId];
    if (r) {
        commit('materializeUserDashboardInvitation', r);
        return;
    }
    r = promises[userId];
    if (r) {
        r.then(v => v && commit('materializeUserDashboardInvitation', v));
        return;
    }
    const promise = userReference(userId).once('value').then(user => {
        const res = {id: userId, ...user.val()};
        commit('materializeUserDashboardInvitation', res);
        commit('addUserResult', res);
        return res;
    }).catch(e => {
        commit('setError', e);
        commit('addUserResultPromise', {userId});
    });
    commit('addUserResultPromise', {userId, promise});
}

function updateDashboardInvitation(commit, user, dashboardId, isInvitation) {
    const updates = {};
    commit('addUserResult', user);
    const value = isInvitation ? true : null;
    updates[userDashboardInvitation(user.id, dashboardId)] = value;
    updates[dashboardUserInvitation(dashboardId, user.id)] = value;
    return db().ref().update(updates).catch(e => {
        commit('setError', e);
    });
}

export interface DashboardInvitation {
    user: User;
    dashboardId: string;
    isInvitation?: boolean;
}
