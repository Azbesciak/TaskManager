<template>
    <v-card>
        <v-list v-if="hasInvitations">
            <v-subheader>Invitations</v-subheader>
            <user-invitation v-for="invitation in notifications.invitations" :invitation="invitation"></user-invitation>
        </v-list>
        <v-alert
                :value="true"
                color="success"
                class="no-notifications"
                icon="check_circle"
                outline
                v-if="nothingToShow"
        >
            <v-layout row wrap>
                <v-flex class="align-self-center">
           No notifications
                </v-flex>
                <v-spacer></v-spacer>
                <v-btn flat @click="onClose">Close</v-btn>
            </v-layout>
        </v-alert>
        <v-card-actions v-else>
            <v-spacer></v-spacer>
            <v-btn flat @click="onClose">Close</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import {mapGetters} from "vuex";
    import UserInvitation from "./UserInvitation";

    export default {
        name: "UserMenuPreviewCard",
        components: {UserInvitation},
        data: () => ({
            fav: true,
            menu: false,
            message: false,
            hints: true
        }),
        computed: {
            ...mapGetters(['notifications']),
            hasInvitations() {
                return this.notifications.invitations.length > 0
            },
            nothingToShow() {
                return !this.hasInvitations;
            }
        },
        methods: {
            onClose() {
                this.$emit('on-close')
            }
        }
    }
</script>
<style scoped lang="scss">
    .no-notifications {
        margin: 0;
        align-content: center;
        button {
            margin: 0;
        }
    }
</style>

