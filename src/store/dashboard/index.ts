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
    actions: {
        cancelDashboardChanges({commit}, {dashboardId}: DashBoardData) {
            dashboards().child(dashboardId).off();
        },
        // https://stackoverflow.com/questions/21500946/firebase-how-to-list-user-specific-data
        listenOnDashBoardChanges({commit}, {dashboardId}: DashBoardData) {
            const dashBoard = dashboards().child(dashboardId);
            dashBoard.on('value', (a, b) => console.log('a b', a, b));
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

export interface DashBoardData {
    owner?: string;
    name: string;
    users: { [key: string]: string }
}

export interface DashboardCreateRequest {
    name: string
}
