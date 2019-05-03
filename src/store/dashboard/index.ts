import * as firebase from 'firebase';
import {randomColor} from '@/plugins/vuetify';
import {HOME_PAGE, router} from '@/router';

let store: firebase.database.Reference = null;

function dashboards() {
    if (!store) {
        store = firebase.database().ref(`/dashboards`);
    }
    return store;
}

function dashboardGroup(dashboardId: string, groupId: string) {
    return dashboards().child(`${dashboardId}/groups/${groupId}`)
}


export const dashboardStore = {
    state: {
        dashboard: null,
    },
    getters: {
        dashboard: state => state.dashboard
    },
    mutations: {
        setDashboard(state, payload: DashboardData) {
            state.dashboard = payload;
        }
    },
    actions: {
        clearDashboard({getters}) {
            const dashboard = getters.dashboard;
            if (dashboard) {
                dashboards().child(dashboard.dashboardId).off();
            }
        },
        selectDashboard({commit, dispatch}, dashboardId: string) {
            dispatch('clearDashboard').then(() => {
                const dashBoard = dashboards().child(dashboardId);
                dashBoard.on('value', newData => {
                    commit('setDashboard', newData ? {dashboardId, ...newData.val()} : null);
                });
            });
        },
        removeDashboard({commit, getters, dispatch}, dashboardId: string) {
            const dashboard = getters.dashboard;
            commit('setLoading', true);
            if (dashboard && dashboard.dashboardId === dashboardId) {
                router.push(HOME_PAGE);
                dispatch('clearDashboard');
            }
            return Promise.all([
                dashboards().child(dashboardId).remove(),
                dispatch('removeUserDashboard', dashboardId)
            ]).then(() => {
                commit('setLoading', false);
            }).catch(e => {
                commit('setError', e);
                commit('setLoading', false);
            });
        },
        addDashboardGroup({dispatch, getters}, name: string) {
            const dashboard = getters.dashboard;
            if (!dashboard) {
                return;
            }
            const value = createDashboardGroup(name);
            return dashboards()
                .child(dashboard.dashboardId)
                .child('groups')
                .push(value)
                .then(v => ({groupId: v.key, ...value}));
        },
        updateDashboardGroup({commit, getters}, {groupId, name, color}: DashboardGroup) {
            const dashboard = getters.dashboard;
            console.log("REQUEST", groupId, dashboard)
            if (!dashboard || !groupId) {
                return;
            }
            commit('setLoading', true);
            dashboardGroup(dashboard.dashboardId, groupId).update({name, color})
                .then(v => {
                    console.log("EEEE", v)
                    commit('setLoading', false);
                }).catch(e => {
                commit('setError', e);
                commit('setLoading', false);
            });
        }
        ,
        createDashboard({commit, dispatch, getters}, {name}: DashboardCreateRequest) {
            commit('setLoading', true);
            const owner = getters.user.id;
            return dispatch('addDashboard', {name})
                .then(v =>
                    dashboards().child(v.key)
                        .set({owner, name})
                        .then(() => v)
                )
                .then(v => {
                    commit('setLoading', false);
                }).catch(e => {
                    commit('setError', e);
                    commit('setLoading', false);
                });
        },
        addDashboard({commit, getters}: any, {name}: DashboardCreateRequest) {
            return getters.currentUserStore.child('dashboards').push({name});
        },
        removeUserDashboard({commit, getters}: any, dashboardId: string) {
            return getters.currentUserStore.child('dashboards').child(dashboardId).remove();
        },
    },
};

export interface DashboardGroup {
    groupId?: string;
    name: string;
    enabled: boolean;
    color: string;
}

function createDashboardGroup(name: string): DashboardGroup {
    return {name, enabled: true, color: randomColor()};
}

export interface DashboardData {
    dashboardId: string;
    owner: string;
    name: string;
    users: { [key: string]: string };
    groups: { [id: string]: DashboardGroup }
}

export interface DashboardCreateRequest {
    name: string
}
