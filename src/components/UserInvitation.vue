<template>
    <v-list-tile>
        <v-list-tile-content>
            <v-list-tile-title>Dashboard: <strong>{{ invitation.name }}</strong></v-list-tile-title>
            <v-list-tile-sub-title class="text--primary">send by <span v-html="senderData"></span>
            </v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action class="actions">
            <v-btn flat icon @click="acceptInvitation" class="green--text">
                <v-icon>done</v-icon>
            </v-btn>
            <v-btn flat icon @click="discardInvitation" class="red--text">
                <v-icon>close</v-icon>
            </v-btn>
        </v-list-tile-action>
    </v-list-tile>
</template>

<script>
    export default {
        name: "UserInvitation",
        props: ['invitation'],
        computed: {
            senderData() {
                const {sender} = this.invitation;
                return sender.name
                    ? `<strong>${sender.name}</strong> (${sender.email})`
                    : `<strong>${sender.email}</strong>`
            }
        }, methods: {
            acceptInvitation() {
                this.$store.dispatch('acceptDashboardInvitation', {
                    dashboardId: this.invitation.id,
                    name: this.invitation.name
                })
            },
            discardInvitation() {
                this.$store.dispatch('discardDashboardInvitation', this.invitation.id)
            }
        }
    }
</script>

<style scoped lang="scss">
    .actions {
        flex-direction: row;
        justify-content: flex-end;
    }
</style>
