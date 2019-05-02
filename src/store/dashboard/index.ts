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
        dashboard: state => state.dashboard,
        dashboards: state => {
            console.log("CALLED",state.user && state.user.dashboards);
            return state.user && state.user.dashboards || null
        }
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
        createDashboard({commit, state, dispatch}, {name}: DashboardCreateRequest) {
            commit('setLoading', true)
            const owner = state.user;
            return dispatch('addDashboard', {name}).then(v => {
                console.log('new dashboard', v);
                commit('setLoading', false);
            }).catch(e => {
                commit('setError', e);
                commit('setLoading', false);
            })
        // .then(r => )
        //     dashboards().push({name, owner: owner.id, users: [owner.id]});
        },
        addDashboard({commit, getters}: any, {name}: DashboardCreateRequest) {
            return getters.currentUserStore.child('dashboards').push({name})
        }
    },
};

export interface DashBoardData {
    dashboardId: string;
    owner?: string;
    name: string;
    users: {[key: string]: string}
}

export interface DashboardCreateRequest {
    name: string
}
