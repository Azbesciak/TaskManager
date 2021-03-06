import {dashboardIdIfDefined} from "@/store/dashboard";
import Vue from 'vue';
export function cleanUpdates(commit, ref, setter: string) {
    commit(setter);
    ref.off();
}

export const set = property => (state, payload) => Vue.set(state, property, payload);

export const toggle = property => state => Vue.set(state, property, !state[property]);

export function listenOnUpdates(commit, ref, setter: string) {
    ref.on("value", value => {
        if (!value) {
            return;
        }
        const result = Object
            .entries(value.val() || {})
            .map(([k, v]) => Object.assign(v, {id: k}));
        commit(setter, result);
    });
}

export function wrapPromiseExecution<T>(commit, f: () => Promise<T>) {
    commit("setLoading", true);
    return f()
        .then(v => {
            commit("setLoading", false);
            return v;
        }).catch(e => {
            commit("setError", e);
            commit("setLoading", false);
        });
}

export function executeIfDashboardDefined<T>(commit, getters, f: (dashboardId: string) => Promise<T>) {
    return ifDashboardDefined(commit, getters, dashboardId => wrapPromiseExecution(commit, () => f(dashboardId)));
}

export function ifDashboardDefined<T>(commit, getters, f: (dashboardId: string) => T) {
    const dashboardId = dashboardIdIfDefined(getters);
    if (!dashboardId) {
        return;
    }
    return f(dashboardId);
}

export function getChangeListener<T extends { id }>(
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
