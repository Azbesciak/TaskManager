import * as firebase from 'firebase';
import {router} from '@/router';
import {UserInfo} from 'firebase';

let store: firebase.database.Reference = null;

export function usersStore() {
    if (!store) {
        store = firebase.database().ref('users');
    }
    return store;
}

export const userStore = {
    state: {
        user: null,
    },
    getters: {
        user: state => state.user,
        isUserSignIn: state => state.user != null,
        currentUserStore: state => usersStore().child(state.user.id)
    },
    mutations: {
        setUser(state, payload?: User) {
            if (state.user) {
                cancelUserUpdates(state.user.id);
            }
            const previous = state.user;
            state.user = payload;
            if (payload && (!previous || previous.id === payload.id)) {
                listenUserUpdates(this, payload);
            }
            router.push('/');
        },
        updateUser(state, payload?: User) {
            if (payload && state.user && payload.id === state.user.id) {
                const {name, email, photoUrl, dashboards} = payload;
                state.user = {id: payload.id, name, email, photoUrl, dashboards};
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
        loginOAuth({commit}: any, {provider}: OAuthProvider) {
            assignUser(commit, a => a.signInWithPopup(provider));
        },
        autoSignIn({commit}: any, user: UserInfo) {
            setUser(commit, user);
        }
    },
};

function listenUserUpdates({commit, getters}: any, user: User) {
    const currentUserStore = getters.currentUserStore;
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
    usersStore().child(userId).off('value');
}

type FireBaseUser = firebase.auth.UserCredential;

function setUser(commit: any, user?: UserInfo) {
    const newUser = user ? {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        dashboards: {}
    } : null;
    commit('setUser', newUser);
}

function assignUser(commit: any, auth: (a: firebase.auth.Auth) => Promise<FireBaseUser | void>) {
    commit('setLoading', true);
    auth(firebase.auth()).then(
        (user: any) => {
            commit('setLoading', false);

        },
        err => {
            commit('setLoading', false);
            commit('setError', err);
        },
    );
}

function createUserEntry(commit, currentUserStore: firebase.database.Reference, {id, ...userToSave}: User) {
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
    dashboards: string[]
}

export interface OAuthProvider {
    provider: firebase.auth.AuthProvider;
}

