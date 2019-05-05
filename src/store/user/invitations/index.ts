import {User, userDashboardInvitationPath, USERS_STORE} from '@/store/user';
import {dashboardUserInvitationPath} from '@/store/dashboard';
import {DashboardInvitation} from '@/store/user-search';
import {reference} from '@/firebase/base';


export function queryUser(query: string) {
    return reference(USERS_STORE).orderByChild('email')
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
    updates[userDashboardInvitationPath(user.id, dashboardId)] = value;
    updates[dashboardUserInvitationPath(dashboardId, user.id)] = value;
    return reference().update(updates).catch(e => {
        commit('setError', e);
    });
}
