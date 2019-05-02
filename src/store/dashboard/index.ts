import * as firebase from 'firebase';

let store: firebase.database.Reference = null;

function dashboards() {
    if (!store) {
        store = firebase.database().ref(`/dashboards`);
    }
    return store;
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
        }
    },
};

export interface DashboardData {
    dashboardId: string;
    owner: string;
    name: string;
    users: { [key: string]: string }
}

export interface DashboardCreateRequest {
    name: string
}
