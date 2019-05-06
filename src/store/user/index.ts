import {router} from '@/router';
import {auth} from '@/firebase/base';
import {userReference} from '@/firebase/user';
import {getChangeListener} from '@/store/storeUtils';

export const userStorePlugin = store => {
    const userListener = getChangeListener(
        isSetUser,
        user => cancelUserUpdates(user.id),
        user => listenUserUpdates(store, user),
        () => router.push('/')
    );
    store.subscribe(({type, payload}) => {
        userListener(type, payload);
    });
};

export function isSetUser(type: string, payload: any): payload is User {
    return type === 'setUser';
}

export const userStore = {
    state: {
        user: null,
    },
    getters: {
        user: state => state.user,
        isUserSignIn: state => state.user != null
    },
    mutations: {
        setUser(state, payload?: User) {
            state.user = payload;
        },
        updateUser(state, payload?: User) {
            if (payload && state.user && payload.id === state.user.id) {
                state.user = payload;
            }
        }
    },
    actions: {
        logout({commit}: any) {
            assignUser(commit, a => a.signOut());
        },
        signUpUser({commit, getters}: any, {email, password}: UserCredentials) {
            assignUser(commit, a => a.createUserWithEmailAndPassword(email, password));
        },
        loginUser({commit}: any, {email, password}: UserCredentials) {
            assignUser(commit, a => a.signInWithEmailAndPassword(email, password));
        },
        loginOAuth({commit}: any, {provider}) {
            assignUser(commit, a => a.signInWithPopup(provider));
        },
        autoSignIn({commit}: any, user) {
            setUser(commit, user);
        }
    },
};

function listenUserUpdates({commit, getters}: any, user: User) {
    const currentUserStore = userReference(getters.user.id);
    currentUserStore.on('value', databaseUser => {
        if (!databaseUser) {
            return;
        }
        if (databaseUser.exists()) {
            commit('updateUser', {id: user.id, ...databaseUser.val()});
        } else {
            createUserEntry(commit, currentUserStore, user);
        }
    });
}

function cancelUserUpdates(userId: string) {
    userReference(userId).off('value');
}

function setUser(commit: any, user?) {
    const newUser = user ? {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        dashboards: {}
    } : null;
    commit('setUser', newUser);
}

function assignUser(commit: any, authf: (a: any) => Promise<any>) {
    commit('setLoading', true);
    authf(auth()).then(
        () => {
            commit('setLoading', false);
        },
        err => {
            commit('setLoading', false);
            commit('setError', err);
        },
    );
}

function createUserEntry(commit, currentUserStore, {id, ...userToSave}: User) {
    currentUserStore
        .set(userToSave)
        .catch(err => commit('setError', err));
}

export interface UserCredentials {
    email: string;
    password: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    photoUrl?: string;
}

