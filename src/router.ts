import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store/store';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '*',
            redirect: '/home',
        },
        {
            path: '/',
            redirect: '/home',
        },
        {
            path: '/signin',
            name: 'Login',
            component: () => import(/* webpackChunkName: "login" */ './views/Login.vue'),
        },
        {
            path: '/signup',
            name: 'SignUp',
            component: () => import(/* webpackChunkName: "signUp" */ './views/SignUp.vue'),
        },
        {
            path: '/home',
            name: 'Home',
            component: () => import(/* webpackChunkName: "home" */ './views/Home.vue'),
            meta: {
                requiresAuth: true,
            },
        },
    ],
});

router.beforeEach((to, from, next) => {
    const currentUser = store.getters.isUserSignIn;
    console.log("CURRENT USER LOGGED IN", currentUser)
    const requiresAuth = to.matched.some(r => r.meta.requiresAuth);
    if (requiresAuth && !currentUser) {
        next('/signin');
    } else {
        next();
    }
});

router.onError((err => console.log("ERROR", err)))

setInterval(() => console.log("CURRENT ROUTE", router.currentRoute), 1000)

export default router;
