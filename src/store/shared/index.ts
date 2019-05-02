export const sharedStore = {
    state: {
        loading: false,
        error: null,
    },
    mutations: {
        setLoading(state, payload) {
            state.loading = payload;
        },
        setError(state, payload) {
            state.error = payload;
        },
        clearError(state) {
            state.error = null;
        }
    },
    actions: {
        clearError({commit}) {
            commit('clearError');
        },
        setError({commit}, payload) {
            commit('setError', payload);
        }
    },
    getters: {
        loading: state =>  state.loading,
        error: state => state.error,
    }
};
