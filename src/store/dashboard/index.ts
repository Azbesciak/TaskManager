import {HOME_PAGE, router} from '@/router';
import {DashboardTask} from '@/store/dashboard-tasks';
import {
    dashboardGroupReference,
    dashboardGroupsReference, dashboardNamePath, dashboardNameReference,
    dashboardPath,
    dashboardReference, dashboardUserPath, dashboardUsersPath, dashboardUsersReference
} from '@/firebase/dashboard';
import {userDashboardPath, userDashboardsReference} from '@/firebase/user';
import {reference} from '@/firebase/base';
import {
    cleanUpdates,
    getChangeListener, ifDashboardDefined,
    listenOnUpdates,
    wrapPromiseExecution
} from '@/store/storeUtils';
import {isSetUser, User} from '@/store/user';


export function dashboardIdIfDefined(getters) {
    const dash = getters.dashboard;
    return dash && dash.id;
}

export const dashboardPlugins = store => {
    const userListener = getChangeListener(
        isSetUser,
        user => cleanUserState(store, user.id),
        user => listenForNewUserUpdates(store, user.id)
    );
    const dashboardListener = getChangeListener(
        isSetDashboard,
        user => cleanDashboardUsers(store, user.id),
        user => listenForNewDashboardUsersUpdates(store, user.id)
    );
    store.subscribe(({type, payload}) => {
        userListener(type, payload);
        dashboardListener(type, payload);
    });
};

export function isSetDashboard(type: string, payload: any): payload is DashboardData {
    return type === 'setDashboard';
}

export const dashboardStore = {
    state: {
        dashboard: null,
        dashboardUsers: [],
        userDashboards: []
    },
    getters: {
        dashboard: state => state.dashboard,
        userDashboards: state => state.userDashboards,
        dashboardUsers: state => state.dashboardUsers
    },
    mutations: {
        setDashboard(state, payload: DashboardData) {
            state.dashboard = payload;
            updateDashboardName(state);
        },
        clearDashboard(state) {
            state.dashboard = null;
        },
        setUserDashboards(state, payload) {
            state.userDashboards = payload;
            updateDashboardName(state);
        },
        clearUserDashboards(state) {
            state.userDashboards = [];
        },
        setDashboardUsers(state, users) {
            state.dashboardUsers = users;
        },
        clearDashboardUsers(state) {
            state.dashboardUsers = [];
        }
    },
    actions: {
        clearDashboard({getters, commit}) {
            const dashboard = getters.dashboard;
            if (dashboard) {
                dashboardReference(dashboard.id).off();
                commit('clearDashboard');
            }
        },
        selectDashboard({commit, dispatch}, dashboardId: string) {
            dispatch('clearDashboard').then(() => {
                dashboardReference(dashboardId).on('value', newData => {
                    commit('setDashboard', newData ? {id: dashboardId, ...newData.val()} : null);
                });
            });
        },
        addDashboardGroup({dispatch, getters}, name: string) {
            const dashboardId = dashboardIdIfDefined(getters);
            if (!dashboardId) {
                return;
            }
            const value = createDashboardGroup(name);
            return dashboardGroupsReference(dashboardId)
                .push(value)
                .then(v => ({groupId: v.key, ...value}));
        },
        updateDashboardGroup({commit, getters}, {groupId, ...data}: DashboardGroup) {
            const dashboardId = dashboardIdIfDefined(getters);
            if (!dashboardId || !groupId) {
                return;
            }
            return wrapPromiseExecution(commit, () => dashboardGroupReference(dashboardId, groupId).update(data));
        },
        removeDashboardGroup({commit, getters}, groupId: string) {
            const dashboardId = dashboardIdIfDefined(getters);
            if (!dashboardId || !groupId) {
                return;
            }
            return wrapPromiseExecution(commit, () => dashboardGroupReference(dashboardId, groupId).remove());
        },
        createDashboard({commit, dispatch, getters}, {name}: DashboardCreateRequest) {
            return wrapPromiseExecution(commit, () => {
                const ownerId = getters.user.id;
                const dashboardId = userDashboardsReference(ownerId).push().key;
                if (!dashboardId) {
                    return;
                }
                const ownerEmail = getters.user.email;
                const updates = {};
                const {id, ...userData} = getters.user;
                updates[userDashboardPath(ownerId, dashboardId)] = {name, ownerId};
                updates[dashboardNamePath(dashboardId)] = {ownerId, name, ownerEmail};
                updates[dashboardUserPath(dashboardId, ownerId)] = userData;
                return reference().update(updates);
            });
        },
        removeDashboard(store: any, dashboardId: string) {
            const user = store.getters.user;
            return onRemoveDashboard(store, user, dashboardId);
        },
        removeUserFromDashboard(store, {user, dashboardId}) {
            return onRemoveDashboard(store, user, dashboardId);
        }
    }
};

function onRemoveDashboard({commit, getters, dispatch}, user: User, dashboardId: string) {
    const currentUser = getters.user;
    return wrapPromiseExecution(commit, () => {
        if (!currentUser) {
            return;
        }
        return dashboardNameReference(dashboardId).once('value').then(v => {
            if (!v || !v.val()) {
                return;
            }
            const {ownerId} = v.val();
            if (!canRemoveUser(user.id, currentUser.id, ownerId)) {
                return;
            }
            if (currentUser.id === user.id) {
                onCurrentDashboardRemove(getters, dashboardId, dispatch);
            }
            if (ownerId === user.id && currentUser.id === ownerId) {
                return removeDashboardByOwner(dashboardId);
            } else {
                return removeUserFromDashboard(user.id, dashboardId);
            }
        });
    });
}

export function canRemoveUser(userId: string, currentUserId: string, dashboardOwnerId: string) {
    return userId === currentUserId || currentUserId === dashboardOwnerId;
}

function onCurrentDashboardRemove(getters, dashboardId: string, dispatch) {
    const dashboard = getters.dashboard;
    if (dashboard && dashboard.id === dashboardId) {
        router.push(HOME_PAGE);
        dispatch('clearDashboard');
    }
}

function removeDashboardByOwner(dashboardId: string) {
    return dashboardUsersReference(dashboardId).once('value').then(users => {
        const updates = {};
        Object.keys(users.val() || {})
            .forEach(userId => updates[userDashboardPath(userId, dashboardId)] = null);
        updates[dashboardNamePath(dashboardId)] = null;
        updates[dashboardPath(dashboardId)] = null;
        updates[dashboardUsersPath(dashboardId)] = null;
        return reference().update(updates);
    });
}

function removeUserFromDashboard(userId: string, dashboardId: string) {
    const updates = {};
    updates[userDashboardPath(userId, dashboardId)] = null;
    updates[dashboardUserPath(dashboardId, userId)] = null;
    return reference().update(updates);
}

function cleanUserState({commit, getters}, userId: string) {
    cleanUpdates(commit, userDashboardsReference(userId), 'clearUserDashboards');
    ifDashboardDefined(commit, getters, dashboardId =>
        cleanUpdates(commit, dashboardReference(dashboardId), 'clearDashboard')
    );
}

function listenForNewUserUpdates({commit}, userId: string) {
    listenOnUpdates(commit, userDashboardsReference(userId), 'setUserDashboards');
}

function cleanDashboardUsers({commit, getters}, dashboardId: string) {
    cleanUpdates(commit, dashboardUsersReference(dashboardId), 'clearDashboardUsers');
}

function listenForNewDashboardUsersUpdates({commit}, dashboardId: string) {
    listenOnUpdates(commit, dashboardUsersReference(dashboardId), 'setDashboardUsers');
}

function updateDashboardName(state) {
    if (state.dashboard && state.userDashboards && state.userDashboards.length > 0) {
        const dashboardHeader = state.userDashboards.find(v => v.id === state.dashboard.id);
        if (dashboardHeader) {
            state.dashboard.name = dashboardHeader.name;
        }
    }
}

export interface DashboardGroup {
    groupId?: string;
    name: string;
    settings?: DashboardGroupSettings;
    tasks?: { [id: string]: DashboardTask }
}

export interface DashboardGroupSettings {
    color?: string;
    dark?: boolean;
    showCompleted?: boolean;
}

function createDashboardGroup(name: string): DashboardGroup {
    return {name, settings: {color: ''}};
}

export interface DashboardHeader {
    id: string;
    ownerId: string;
    name: string;
    ownerEmail: string;
}

export interface DashboardData {
    id: string;
    name?: string;
    ownerId: string;
    groups?: { [id: string]: DashboardGroup }
}

export interface DashboardCreateRequest {
    name: string
}
