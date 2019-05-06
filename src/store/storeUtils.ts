import {dashboardIdIfDefined} from '@/store/dashboard';

export function cleanUpdates(commit, ref, setter: string) {
    commit(setter);
    ref.off();
}

export function listenOnUpdates(commit, ref, setter: string) {
    ref.on('value', value => {
        if (!value) {
            return;
        }
        commit(setter, value.val() || {});
    });
}

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

export function executeIfDashboardDefined<T>(commit, getters, f: (dashboardId: string) => Promise<T>) {
    return ifDashboardDefined(commit, getters, dashboardId => wrapPromiseExecution(commit, () => f(dashboardId)))
}

export function ifDashboardDefined<T>(commit, getters, f: (dashboardId: string) => T) {
    const dashboardId = dashboardIdIfDefined(getters);
    if (!dashboardId) {
        return;
    }
    return f(dashboardId);
}

export function getChangeListener<T extends {id}>(
    check: (type: string, payload: any) => payload is T,
    onOldValue: (value: T) => void,
    onNewValue: (value: T) => void,
    onChange: () => void = () => null,
) {
    let currentValue: T | null = null;
    const equalsOld = newUser => {
        if (!currentValue && !newUser) {
            return true;
        }
        if (!currentValue || !newUser) {
            return false;
        }
        return currentValue.id === newUser.id;
    };
    return (type: string, payload: any) => {
        if (!check(type, payload) || equalsOld(payload)) {
            return;
        }
        if (currentValue) {
            onOldValue(currentValue);
        }
        if (payload) {
            onNewValue(payload);
        }
        onChange();
        currentValue = payload;
    };
}
