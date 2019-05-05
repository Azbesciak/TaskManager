import * as firebase from 'firebase';
import {User, userDashboardInvitation, USERS_STORE} from '@/store/user';
import {dashboardUserInvitation} from '@/store/dashboard';
import {DashboardInvitation} from '@/store/user-search';

let _db: firebase.database.Database | null = null;

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


export const userInvitationsStore = {
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
    commit('addUserResultPromise', {userId: user.id, promise: Promise.resolve(user)});
    const value = isInvitation ? true : null;
    updates[userDashboardInvitation(user.id, dashboardId)] = value;
    updates[dashboardUserInvitation(dashboardId, user.id)] = value;
    return db().ref().update(updates).catch(e => {
        commit('setError', e);
    });
}
