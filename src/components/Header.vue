<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div>
        <v-navigation-drawer fixed temporary v-model="sideNav">
            <v-img :aspect-ratio="16/9" src="https://cdn.vuetifyjs.com/images/parallax/material.jpg">
                <v-layout pa-2 column fill-height class="lightbox white--text">
                    <v-spacer></v-spacer>
                    <v-flex shrink v-if="isUserSignIn">
                        <v-avatar left v-if="user.photoUrl">
                            <img :src="user.photoUrl">
                        </v-avatar>
                        <v-content right>
                            <div class="subheading" v-if="user.name">{{user.name}}</div>
                            <div class="body-1">{{user.email}}</div>
                        </v-content>
                    </v-flex>
                </v-layout>
            </v-img>
            <v-list>
                <template v-if="isUserSignIn">
                    <dashboards-list></dashboards-list>
                    <v-list-tile @click="onLogout">
                        <v-list-tile-action>
                            <v-icon>exit_to_app</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>Logout</v-list-tile-content>
                    </v-list-tile>
                </template>
                <template v-else>
                    <v-list-tile vi v-for="item in menuItems" :key="item.title" :to="item.link">
                        <v-list-tile-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>{{ item.title }}</v-list-tile-content>
                    </v-list-tile>
                </template>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar dark class="primary">
            <v-toolbar-side-icon
                    @click.stop="sideNav = !sideNav"
                    class="hidden-sm-and-up "></v-toolbar-side-icon>
            <v-toolbar-title>
                <router-link to="/" tag="span" style="cursor: pointer">Task Manager</router-link>
            </v-toolbar-title>
                    <v-menu open-on-hover bottom  offset-y v-if="isUserSignIn">
                        <template v-slot:activator="{ on }">
                            <v-btn flat v-on="on" @click="goToDashboard">
                                {{name}}
                            </v-btn>
                        </template>
                        <dashboards-list></dashboards-list>
                    </v-menu>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-xs-only">
                <template v-if="isUserSignIn">
                    <v-btn flat @click="onLogout">
                        <v-icon left>exit_to_app</v-icon>
                        Logout
                    </v-btn>
                    <v-btn flat>
                        <v-list-tile avatar>
                            <v-list-tile-avatar v-if="user.photoUrl">
                                <img :src="user.photoUrl">
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title>{{user.name || user.email}}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-btn>
                </template>
                <template v-else>
                    <v-btn flat v-for="item in menuItems" :key="item.title" :to="item.link">
                        <v-icon left dark>{{ item.icon }}</v-icon>
                        {{ item.title }}
                    </v-btn>
                </template>
            </v-toolbar-items>
        </v-toolbar>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import {goToDashboard} from "../router";

    export default {
        data() {
            return {
                sideNav: false,
                menuItems: [
                    {icon: 'face', title: 'Sign up', link: '/signup'},
                    {icon: 'lock_open', title: 'Sign in', link: '/signin'}
                ]
            }
        },
        computed: {
            ...mapGetters(['user', 'isUserSignIn', 'dashboard']),
            name() {
                return this.dashboard ? this.dashboard.name : 'Your Dashboards'
            }
        },
        methods: {
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
