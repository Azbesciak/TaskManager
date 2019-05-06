import {reference} from '@/firebase/base';

const USERS_STORE = 'users';

function usersPath() {
    return `${USERS_STORE}/data`
}

export function userPath(userId: string) {
    return `${usersPath()}/${userId}`;
}

export function userReference(userId: string) {
    return reference(userPath(userId));
}

export function userDashboardInvitationsPath(userId: string) {
    return `${USERS_STORE}/invitations/${userId}`
}

export function userDashboardInvitationsReference(userId: string) {
    return reference(userDashboardInvitationsPath(userId))
}

export function userDashboardInvitationPath(userId: string, dashboardId: string) {
    return `${userDashboardInvitationsPath(userId)}/${dashboardId}`;
}

export function userDashboardsPath(userId: string) {
    return `${USERS_STORE}/dashboards/${userId}`;
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
    return reference(usersPath()).orderByChild('email')
        .startAt(query)
        .limitToFirst(10)
        .once('value')
        .then(value =>
            Object
                .entries(value.val() || {})
                .map(([k, v]) => Object.assign(v, {id: k}))
        );
}
