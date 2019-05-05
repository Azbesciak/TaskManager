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

let currentRequestId = 0;

export const userSearchStore = {
    state: {
        dashboardInvitedUsers: {},
        usersResultsPromises: {}
    },
    mutations: {
        addUserResultPromise(state, {userId, promise}) {
            state.usersResultsPromises[userId] = promise;
        },
        newDashboardUserInvitations(state) {
            state.dashboardInvitedUsers = {
                invitationsId: ++currentRequestId,
                users: {}
            };
        },
        materializeUserDashboardInvitation(state, payload: IdentifiedUser) {
            const invitations = state.dashboardInvitedUsers;
            if (invitations && invitations.invitationsId === currentRequestId) {
                const {requestId, ...user} = payload;
                if (requestId === currentRequestId)
                    Vue.set(invitations.users, payload.id, user);
            }
        }
    },
    getters: {
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
            commit('newDashboardUserInvitations');
            const currentId = currentRequestId;
            Object.keys(dashboard.invitations || {})
                .forEach(userId => cacheUserData(userId, commit, promises, currentId));
        }
    }
};

const MAX_RETRIES = 5;
const RETRY_DELAY = 1000;

function fetchUser(userId: string, commit, requestId: number, retries: number = 0) {
    return userReference(userId).once('value').then(user => {
        const res = {id: userId, ...user.val()};
        commit('materializeUserDashboardInvitation', {requestId, ...res});
        return res;
    }).catch((e: any) => {
        if (retries > 0) {
            return retryUserFetchWithDelay(userId, commit, requestId, retries);
        } else if (requestId === currentRequestId) {
            commit('setError', e);
            commit('addUserResultPromise', {userId});
        }
    });
}


function retryUserFetchWithDelay(userId: string, commit, requestId: number, retries: number) {
    return new Promise((resolve => setTimeout(
        () => resolve(fetchUser(userId, commit, requestId, retries - 1)),
        (MAX_RETRIES - retries) * RETRY_DELAY
    )));
}

function tryToFetchUser(userId: string, commit, requestId: number, retries: number = MAX_RETRIES) {
    const promise = fetchUser(userId, commit, requestId, retries);
    commit('addUserResultPromise', {userId, promise});
}

function cacheUserData(userId: string, commit, promises, requestId: number) {
    const r = promises[userId];
    if (r) {
        r.then(v => {
            if (v) {
                commit('materializeUserDashboardInvitation', {requestId, ...v});
            } else {
                fetchUser(userId, commit, requestId);
            }
        });
        return;
    }
    return tryToFetchUser(userId, commit, requestId);
}

function updateDashboardInvitation(commit, user: User, dashboardId: string, isInvitation: boolean) {
    const updates = {};
    commit('addUserResultPromise', {userId: user.id, promise: Promise.resolve(user)});
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

export interface IdentifiedUser extends User{
    requestId: number;
}
