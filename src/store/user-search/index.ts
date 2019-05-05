import {User, userReference} from '@/store/user';
import Vue from 'vue';

export const userStorePlugins = [store => {
    store.subscribe(mutations => {
        if (mutations.type === 'setDashboard') {
            store.dispatch('fetchDashboardInvitedUsers', mutations.payload);
        }
    });
}];

const MAX_RETRIES = 5;
const RETRY_DELAY = 1000;

function createStore() {
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

    let currentRequestId = 0;
    return {
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
                    requestId: ++currentRequestId,
                    payload: {}
                };
            },
            materializeUserDashboardInvitation(state, payload: IdentifiedUser) {
                const invitations = state.dashboardInvitedUsers;
                if (invitations && invitations.requestId === currentRequestId) {
                    const {requestId, ...user} = payload;
                    if (requestId === currentRequestId) {
                        Vue.set(invitations.payload, payload.id, user);
                    }
                }
            }
        },
        getters: {
            usersResultsPromises: state => state.usersResultsPromises,
            dashboardInvitedUsers: state => state.dashboardInvitedUsers.payload
        },
        actions: {
            fetchDashboardInvitedUsers({getters, commit}, dashboard) {
                const promises = getters.usersResultsPromises;
                commit('newDashboardUserInvitations');
                const currentId = currentRequestId;
                Object.keys(dashboard.invitations || {})
                    .forEach(userId => cacheUserData(userId, commit, promises, currentId));
            }
        }
    };
}

export const userSearchStore = createStore();

export interface DashboardInvitation {
    user: User;
    dashboardId: string;
    isInvitation?: boolean;
}

export interface IdentifiedUser extends User {
    requestId: number;
}
