import {User} from '@/store/user';
import {DashboardInvitation} from '@/store/user-search';
import {reference} from '@/firebase/base';
import {dashboardUserInvitationPath} from '@/firebase/dashboard';
import {userDashboardInvitationPath} from '@/firebase/user';

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
