import {HOME_PAGE, router} from '@/router';
import {DashboardTask} from '@/store/dashboard-tasks';
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

export function dashboardGroupPath(dashboardId: string, groupId: string) {
    return `${dashboardPath(dashboardId)}/groups/${groupId}`
}

export function dashboardGroupReference(dashboardId: string, groupId: string) {
    return reference(dashboardGroupPath(dashboardId, groupId))
}

export function dashboardIdIfDefined(getters) {
    const dash = getters.dashboard;
    return dash && dash.dashboardId;
}

export const dashboardStore = {
    state: {
        dashboard: null,
    },
    getters: {
        dashboard: state => state.dashboard
    },
    mutations: {
        setDashboard(state, payload: DashboardData) {
            state.dashboard = payload;
        }
    },
    actions: {
        clearDashboard({getters}) {
            const dashboard = getters.dashboard;
            if (dashboard) {
                dashboardReference(dashboard.dashboardId).off();
            }
        },
        selectDashboard({commit, dispatch}, dashboardId: string) {
            dispatch('clearDashboard').then(() => {
                const dashBoard = dashboardReference(dashboardId);
                dashBoard.on('value', newData => {
                    commit('setDashboard', newData ? {dashboardId, ...newData.val()} : null);
                });
            });
        },
        removeDashboard({commit, getters, dispatch}, dashboardId: string) {
            const dashboard = getters.dashboard;
            return wrapPromiseExecution(commit, () => {
                if (dashboard && dashboard.dashboardId === dashboardId) {
                    router.push(HOME_PAGE);
                    dispatch('clearDashboard');
                }
                return Promise.all([
                    dashboardReference(dashboardId).remove(),
                    dispatch('removeUserDashboard', dashboardId)
                ]);
            });
        },
        addDashboardGroup({dispatch, getters}, name: string) {
            const dashboardId = dashboardIdIfDefined(getters);
            if (!dashboardId) {
                return;
            }
            const value = createDashboardGroup(name);
            return dashboardReference(dashboardId)
                .child('groups')
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
                const owner = getters.user.id;
                return dispatch('addDashboard', {name})
                    .then(v =>
                        dashboards().child(v.key)
                            .set({owner, name})
                            .then(() => v)
                    );
            });
        },
        addDashboard({commit, getters}: any, {name}: DashboardCreateRequest) {
            return getters.currentUserStore.child('dashboards').push({name});
        },
        removeUserDashboard({commit, getters}: any, dashboardId: string) {
            return getters.currentUserStore.child('dashboards').child(dashboardId).remove();
        }
    }
};

export function wrapPromiseExecution<T>(commit, f: () => Promise<T>) {
    commit('setLoading', true);
    return f()
        .then(v => {
            commit('setLoading', false);
            return v;
        }).catch(e => {
            commit('setError', e);
            commit('setLoading', false);
        });
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

export interface DashboardData {
    dashboardId: string;
    owner: string;
    name: string;
    users?: { [key: string]: string };
    invitations?: {[key: string]: boolean}
    groups?: { [id: string]: DashboardGroup }
}

export interface DashboardCreateRequest {
    name: string
}
