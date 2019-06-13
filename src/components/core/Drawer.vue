<template>
    <v-navigation-drawer
            id="app-drawer"
            v-model="inputValue"
            app
            dark
            floating
            persistent
            mobile-break-point="991"
            width="260"
    >
        <v-img
                :src="image"
                :gradient="sidebarOverlayGradiant"
                height="100%"
        >
            <v-layout
                    class="fill-height"
                    tag="v-list"
                    column
            >
                <v-list-tile
                        :active-class="color"
                        avatar
                        class="v-list-item"
                >
                    <v-list-tile-avatar color="transparent" class="no-elevation">
                        <v-img :src="logo" height="34" contain/>
                    </v-list-tile-avatar>
                    <v-list-tile-title class="title">
                        Task Manager
                    </v-list-tile-title>
                </v-list-tile>
                <v-divider/>
                <template v-if="isUserSignIn">
                    <dashboards-list :navigable="true"></dashboards-list>
                    <v-list-tile @click="onLogout"
                                 :active-class="color"
                                 avatar
                                 class="v-list-item"
                    >
                        <v-list-tile-action>
                            <v-icon>exit_to_app</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>Logout</v-list-tile-content>
                    </v-list-tile>
                </template>
                <template v-else>
                    <v-list-tile vi v-for="item in menuItems" :key="item.title" :to="item.link" :active-class="color"
                                 avatar
                                 class="v-list-item">
                        <v-list-tile-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>{{ item.title }}</v-list-tile-content>
                    </v-list-tile>
                </template>
            </v-layout>
        </v-img>
    </v-navigation-drawer>
</template>

<script>
    // Utilities
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        data: () => ({
            logo: './img/icon-main.svg',
            menuItems: [
                {icon: 'face', title: 'Sign up', link: '/signup'},
                {icon: 'lock_open', title: 'Sign in', link: '/signin'}
            ],
            responsive: false
        }),
        computed: {
            ...mapGetters(['image', 'color', 'user', 'isUserSignIn', 'dashboard']),
            name() {
                return this.dashboard ? this.dashboard.name : 'Your Dashboards'
            },
            items() {
                return this.$t('Layout.View.items')
            },
            sidebarOverlayGradiant() {
                const value = this.$store.state.appStore.sidebarBackgroundColor
                return `${value}, ${value}`
            },
            inputValue: {
                get() {
                    return this.$store.state.appStore.drawer
                },
                set(val) {
                    this.setDrawer(val)
                }
            }
        },
        mounted() {
            this.onResponsiveInverted();
            window.addEventListener('resize', this.onResponsiveInverted)
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.onResponsiveInverted)
        },
        methods: {
            ...mapMutations(['setDrawer', 'toggleDrawer']),
            onResponsiveInverted() {
                this.responsive = window.innerWidth < 991;
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

<style lang="scss">
    #app-drawer {
        .no-elevation {
            margin-left: 0;
            .v-avatar {
                box-shadow: none;
            }
        }

        .v-list__tile {
            border-radius: 4px;
        }

        .v-image__image--contain {
            top: 9px;
            height: 60%;
        }

        div.v-responsive.v-image > div.v-responsive__content {
            overflow-y: auto;
        }
    }
</style>
