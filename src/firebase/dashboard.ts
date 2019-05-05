import {reference} from '@/firebase/base';

export const DASHBOARDS_STORE = `dashboards`;

export function dashboards() {
    return reference(DASHBOARDS_STORE);
}

export function dashboardPath(dashboardId: string) {
    return `${DASHBOARDS_STORE}/${dashboardId}`;
}

export function dashboardReference(dashboardId: string) {
    return reference(dashboardPath(dashboardId))
}

export function dashboardUserInvitationPath(dashboardId: string, userId: string) {
    return `${dashboardPath(dashboardId)}/invitations/${userId}`
}

export function dashboardGroupsPath(dashboardId: string) {
    return `${dashboardPath(dashboardId)}/groups`
}

export function dashboardGroupsReference(dashboardId: string) {
    return reference(dashboardGroupsPath(dashboardId))
}

export function dashboardGroupPath(dashboardId: string, groupId: string) {
    return `${dashboardGroupsPath(dashboardId)}/${groupId}`
}

export function dashboardGroupReference(dashboardId: string, groupId: string) {
    return reference(dashboardGroupPath(dashboardId, groupId))
}
