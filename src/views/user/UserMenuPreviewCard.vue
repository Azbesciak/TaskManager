<template>
    <v-card>
        <v-list v-if="hasInvitations">
            <v-subheader>Invitations</v-subheader>
            <user-invitation v-for="invitation in notifications.invitations" :invitation="invitation"></user-invitation>
        </v-list>
        <v-card-actions>
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
            }
        },
        methods: {
            onClose() {
                this.$emit('on-close')
            }
        }
    }
</script>

