import * as firebase from 'firebase';
import router from '@/router';

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
            console.log("SETTING USEER", payload);
            setTimeout(() => {
                router.push('/');
            })
        },
    },
    actions: {
        logout({commit}) {
            assignUser(commit, a => a.signOut());
        },
        signUpUser({commit}: any, {email, password}: UserCredentials) {
            assignUser(commit, a => a.createUserWithEmailAndPassword(email, password));
        },
        loginUser({commit}: any, {email, password}: UserCredentials) {
            assignUser(commit, a => a.signInWithEmailAndPassword(email, password));
        },
        loginOAuth({commit}: any, {provider}: OAuthProvider) {
            assignUser(commit, a => a.signInWithPopup(provider));
        },
        autoSignIn({commit}: any, user: FireBaseUser) {
            setUser(commit, user);
        },
    },
};

type FireBaseUser = firebase.auth.UserCredential;

function setUser(commit: any, user: any) {
    const newUser = user ? {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
    } : null;
    commit('setUser', newUser);
}

function assignUser(commit: any, auth: (a: firebase.auth.Auth) => Promise<FireBaseUser | void>) {
    commit('setLoading', true);
    auth(firebase.auth()).then(
        (user: any) => {
            commit('setLoading', false);
            setUser(commit, user);
        },
        err => {
            commit('setLoading', false);
            commit('setError', err);
        },
    );
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

export interface OAuthProvider {
    provider: firebase.auth.AuthProvider;
}

