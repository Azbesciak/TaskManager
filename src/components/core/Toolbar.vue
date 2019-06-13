<template>
    <v-toolbar
            id="core-toolbar"
            flat
            prominent
            style="background: #eee;"
    >
        <div class="v-toolbar-title">
            <v-toolbar-title
                    class="tertiary--text font-weight-light"
            >
                <v-btn
                        v-if="responsive"
                        class="default v-btn--simple"
                        dark
                        icon
                        @click.stop="onClickBtn"
                >
                    <v-icon>list</v-icon>
                </v-btn>
                {{ title }}
            </v-toolbar-title>
        </div>

        <v-spacer/>
        <v-toolbar-items>
            <v-flex
                    align-center
                    layout
                    py-2
            >
                <template v-if="isUserSignIn">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn flat icon @click="onLogout" v-on="on">
                                <v-icon>exit_to_app</v-icon>
                            </v-btn>
                        </template>
                        <span>Logout</span>
                    </v-tooltip>
                    <user-menu-preview></user-menu-preview>
                </template>
                <template v-else>
                    <v-tooltip bottom v-for="item in menuItems" >
                        <template v-slot:activator="{ on }">
                            <v-btn flat icon :key="item.title" :to="item.link" v-on="on">
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-btn>
                        </template>
                        <span>{{item.title}}</span>
                    </v-tooltip>
                </template>
            </v-flex>
        </v-toolbar-items>
    </v-toolbar>
</template>

<script>

    import {mapGetters, mapMutations} from "vuex";
    import {goToDashboard} from "../../router";
    import UserMenuPreview from "../../views/user/UserMenuPreview";

    export default {
        components: {
            UserMenuPreview
        },
        data: () => ({
            title: null,
            responsive: false,
            sideNav: false,
            menuItems: [
                {icon: 'face', title: 'Sign up', link: '/signup'},
                {icon: 'lock_open', title: 'Sign in', link: '/signin'}
            ]
        }),

        watch: {
            '$route'(val) {
                this.title = val.name
            }
        },

        mounted() {
            this.onResponsiveInverted()
            window.addEventListener('resize', this.onResponsiveInverted)
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.onResponsiveInverted)
        },
        computed: {
            ...mapGetters(['user', 'isUserSignIn', 'dashboard']),
            name() {
                return this.dashboard ? this.dashboard.name : 'Your Dashboards'
            }
        },
        methods: {
            ...mapMutations(['setDrawer', 'toggleDrawer']),
            onClickBtn() {
                this.toggleDrawer()
            },
            onClick() {
                //
            },
            onResponsiveInverted() {
                if (window.innerWidth < 991) {
                    this.responsive = true
                } else {
                    this.responsive = false
                }
            },
            onLogout() {
                this.$store.dispatch("logout")
            },
            goToDashboard() {
                const dashboard = this.dashboard;
                if (dashboard) {
                    goToDashboard(dashboard.id, dashboard.name)
                }
            }
        }
    }
</script>

<style>
    #core-toolbar a {
        text-decoration: none;
    }

</style>
