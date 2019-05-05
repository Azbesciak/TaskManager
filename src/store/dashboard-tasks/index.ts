import {dashboardIdIfDefined, wrapPromiseExecution} from '@/store/dashboard';
import {dashboardGroupReference} from '@/firebase/dashboard';

export const tasksStore = {
    actions: {
        addTask({commit, getters}, {groupId, ...task}) {
            return executeIfDashboardDefined(commit, getters, dashboardId =>
                dashboardGroupReference(dashboardId, groupId)
                    .child('tasks')
                    .push(task));
        },
        removeTask({commit, getters}, {groupId, taskId}) {
            return executeIfDashboardDefined(commit, getters, dashboardId =>
                dashboardGroupReference(dashboardId, groupId)
                    .child(`tasks/${taskId}`)
                    .remove()
            );
        },
        completeTask({commit, getters}, {groupId, taskId, completed = true}) {
            return executeIfDashboardDefined(commit, getters, dashboardId =>
                dashboardGroupReference(dashboardId, groupId)
                    .child(`tasks/${taskId}/completed`)
                    .set(completed)
            );
        }
    }
};

export function executeIfDashboardDefined<T>(commit, getters, f: (dashboardId: string) => Promise<T>) {
    const dashboardId = dashboardIdIfDefined(getters);
    if (!dashboardId) {
        return;
    }
    return wrapPromiseExecution(commit, () => f(dashboardId));
}

export interface DashboardTask {
    taskId?: string;
    taskName: string;
    description?: string;
    completed?: boolean;
}
