<template>
    <v-list>
        <user-snapshot v-for="value in dashboardInvitedUsers" :user="value">
            <v-btn icon flat @click.stop="cancelInvitation(value)">
                <v-icon>delete</v-icon>
            </v-btn>
        </user-snapshot>
    </v-list>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "DashboardUsersList",
        props: ['dashboardId'],
        computed: mapGetters(['dashboardInvitedUsers']),
        methods: {
            cancelInvitation(user) {
                this.$store.dispatch('sendDashboardInvitationCancellation', {user, dashboardId: this.dashboardId})
            }
        }
    }
</script>

<style scoped>

</style>
