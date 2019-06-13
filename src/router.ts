import Vue from 'vue';
import Router, {RawLocation} from 'vue-router';
import store from '@/store/store';

Vue.use(Router);

export const AUTH_PAGE = '/signin';
export const HOME_PAGE = '/dashboard';

export function goToDashboard(id, name) {
    router.push(`${HOME_PAGE}/${id}/${name}`)
}

export function goToDashboards() {
    router.push(HOME_PAGE);
}

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
            name: 'Dashboards',
            component: () => import(/* webpackChunkName: "dashboards" */ './views/dashboard/Dashboards.vue'),
            meta: {
                requiresAuth: true
            },
        }, {
            path: `${HOME_PAGE}/:id/:name`,
            name: `Dashboard`,
            component: () => import(/* webpackChunkName: "dashboard" */ './views/dashboard/Dashboard.vue')
        },
    ],
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        if (to.hash) {
            return { selector: to.hash }
        }
        return { x: 0, y: 0 }
    }
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
