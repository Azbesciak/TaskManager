import {reference} from '@/firebase/base';

export const USERS_STORE = 'users';

export function usersStore() {
    return reference(USERS_STORE);
}

export function userPath(userId: string) {
    return `${USERS_STORE}/${userId}`;
}

export function userReference(userId: string) {
    return usersStore().child(userId);
}

export function userDashboardInvitationPath(userId: string, dashboardId: string) {
    return `${userPath(userId)}/invitations/${dashboardId}`;
}

export function userDashboardsPath(userId: string) {
    return `${userPath(userId)}/dashboards`;
}

export function userDashboardsReference(userId: string) {
    return reference(userDashboardsPath(userId))
}

export function userDashboardPath(userId: string, dashboardId: string) {
    return `${userDashboardsPath(userId)}/${dashboardId}`
}

export function userDashboardReference(userId: string, dashboardId: string) {
    return reference(userDashboardPath(userId, dashboardId))
}

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
