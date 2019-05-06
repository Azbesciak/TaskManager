<template>
    <div>
        <v-list subheader v-if="showInvitations">
            <v-subheader>Pending invitations</v-subheader>
            <user-snapshot v-for="value in dashboardInvitedUsers" :user="value">
                <v-btn icon flat @click.stop="cancelInvitation(value)">
                    <v-icon>delete</v-icon>
                </v-btn>
            </user-snapshot>
        </v-list>
        <v-list subheader>
            <v-subheader>Members</v-subheader>
            <user-snapshot v-for="value in dashboardUsers" :user="value">
                <v-btn icon flat @click.stop="removeUser(value)" v-if="canRemoveUser(value)">
                    <v-icon>delete</v-icon>
                </v-btn>
            </user-snapshot>
        </v-list>
    </div>
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

<style scoped>

</style>
