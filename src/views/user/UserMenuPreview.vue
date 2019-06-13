<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-width="100"
            offset-y
    >
        <template v-slot:activator="{ on }">
            <v-btn flat icon v-on="on">
                <v-badge color="red" class="notification-badge" overlap >
                    <template v-slot:badge v-if="showNotifications">
                        <span class="notification-badge-number">{{notificationSign}}</span>
                    </template>
                    <v-icon>notification_important</v-icon>
                </v-badge>
            </v-btn>
        </template>
        <user-menu-preview-card @on-close="menu=false"></user-menu-preview-card>
    </v-menu>
</template>
<script>
    import {mapGetters} from "vuex";
    import UserMenuPreviewCard from "./UserMenuPreviewCard";

    export default {
        name: 'UserMenuPreview',
        data() {
            return {
                menu: false
            }
        },
        components: {UserMenuPreviewCard},
        computed: {
            ...mapGetters(['user', 'notificationsNumber']),
            showNotifications() {
                return this.notificationsNumber > 0;
            },
            notificationSign() {
                return this.notificationsNumber < 10 ? this.notificationsNumber : '!';
            }
        },

    }
</script>
<style>
    .notification-badge {
        top: 3px;
    }
    .notification-badge-number {
        line-height: 20px;
        font-weight: 500;
    }
</style>
