import {reference} from '@/firebase/base';

const DASHBOARDS_STORE = `dashboards`;

export function dashboardPath(dashboardId: string) {
    return `${DASHBOARDS_STORE}/data/${dashboardId}`;
}

export function dashboardReference(dashboardId: string) {
    return reference(dashboardPath(dashboardId));
}

function dashboardUserInvitations(dashboardId: string) {
    return `${DASHBOARDS_STORE}/invitations/${dashboardId}`;
}

export function dashboardUserInvitationPath(dashboardId: string, userId: string) {
    return `${dashboardUserInvitations(dashboardId)}/${userId}`;
}

export function dashboardUserInvitationsReference(dashboardId: string) {
    return reference(dashboardUserInvitations(dashboardId));
}

export function dashboardNamesPath() {
    return `${DASHBOARDS_STORE}/headers`;
}

export function dashboardUsersPath(dashboardId: string) {
    return `${DASHBOARDS_STORE}/users/${dashboardId}`;
}

export function dashboardUsersReference(dashboardId: string) {
    return reference(dashboardUsersPath(dashboardId));
}

export function dashboardUserPath(dashboardId: string, userId: string) {
    return `${dashboardUsersPath(dashboardId)}/${userId}`;
}

export function dashboardNamePath(dashboardId: string) {
    return `${dashboardNamesPath()}/${dashboardId}`;
}

export function dashboardGroupsPath(dashboardId: string) {
    return `${dashboardPath(dashboardId)}/groups`;
}

export function dashboardGroupsReference(dashboardId: string) {
    return reference(dashboardGroupsPath(dashboardId));
}

export function dashboardGroupPath(dashboardId: string, groupId: string) {
    return `${dashboardGroupsPath(dashboardId)}/${groupId}`;
}

export function dashboardGroupReference(dashboardId: string, groupId: string) {
    return reference(dashboardGroupPath(dashboardId, groupId));
}
