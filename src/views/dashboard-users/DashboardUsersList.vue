<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-expansion-panel id="dashboard-users" expand>
        <v-expansion-panel-content v-if="showInvitations">
            <template v-slot:header>
                <div>Pending invitations</div>
            </template>
            <user-snapshot v-for="value in dashboardInvitedUsers" :user="value">
                <v-btn icon flat @click.stop="cancelInvitation(value)">
                    <v-icon>delete</v-icon>
                </v-btn>
            </user-snapshot>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
            <template v-slot:header>
                <div>Members</div>
            </template>
            <user-snapshot v-for="value in dashboardUsers" :user="value">
                <v-btn icon flat @click.stop="removeUser(value)" v-if="canRemoveUser(value)">
                    <v-icon>delete</v-icon>
                </v-btn>
            </user-snapshot>
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>

<script>
    import {mapGetters} from "vuex";
    import {canRemoveUser} from "../../store/dashboard";

    export default {
        name: "DashboardUsersList",
        props: ['dashboardId'],
        computed: {
            ...mapGetters(['dashboardInvitedUsers', 'dashboardUsers', 'dashboard', 'user']),
            showInvitations() {
                return this.dashboardInvitedUsers && this.dashboardInvitedUsers.length > 0;
            }
        },
        methods: {
            cancelInvitation(user) {
                this.dispatch('sendDashboardInvitationCancellation', user)
            },
            removeUser(user) {
                this.dispatch('removeUserFromDashboard', user)
            },
            dispatch(method, user) {
                this.$store.dispatch(method, {user, dashboardId: this.dashboardId})
            },
            canRemoveUser(user) {
                return this.user && this.dashboard && canRemoveUser(user.id, this.user.id, this.dashboard.ownerId)
            }
        },
    }
</script>

<style lang="scss">
    .v-expansion-panel {
        box-shadow: none;

        .v-expansion-panel__body {
            margin-bottom: 10px;
        }
    }
</style>
