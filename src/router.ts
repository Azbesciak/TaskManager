import Vue from 'vue';
import Router, {RawLocation} from 'vue-router';
import store from '@/store/store';

Vue.use(Router);

export const AUTH_PAGE = '/signin';
export const HOME_PAGE = '/dashboard';

export const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '*',
            redirect: HOME_PAGE
        },
        {
            path: '/',
            redirect: HOME_PAGE
        },
        {
            path: AUTH_PAGE,
            name: 'Login',
            component: () => import(/* webpackChunkName: "login" */ './views/auth/Login.vue'),
        },
        {
            path: '/signup',
            name: 'SignUp',
            component: () => import(/* webpackChunkName: "signUp" */ './views/auth/SignUp.vue'),
        },
        {
            path: HOME_PAGE,
            name: 'Dashboard',
            component: () => import(/* webpackChunkName: "home" */ './views/dashboard/Dashboards.vue'),
            meta: {
                requiresAuth: true
            },
        },
    ],
});
router.beforeEach((to, from, next) => {
    const currentUser = store.getters.isUserSignIn;
    const requiresAuth = to.matched.some(r => r.meta.requiresAuth);
    if (requiresAuth && !currentUser) {
        next(AUTH_PAGE);
    } else {
        next();
    }
});

const oldPush = router.push.bind(router);
router.push = (location, onComplete, onAbort) => {
    const newRoute = router.resolve(location);
    const authRequred = newRoute.route.meta.requiresAuth;
    let newLocation: RawLocation = newRoute.location;
    if (authRequred && !store.getters.isUserSignIn) {
        newLocation = AUTH_PAGE;
    }
    oldPush(newLocation, onComplete, onAbort);
};
