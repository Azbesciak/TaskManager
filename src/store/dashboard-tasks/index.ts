import {dashboardGroupReference} from '@/firebase/dashboard';
import {executeIfDashboardDefined} from '@/store/storeUtils';

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

export interface DashboardTask {
    taskId?: string;
    taskName: string;
    description?: string;
    completed?: boolean;
}
