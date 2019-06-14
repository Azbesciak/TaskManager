<template>
    <v-dialog v-model="show" max-width="500px">
        <v-card>
            <v-card-title class="headline">Invite User</v-card-title>
            <v-card-text>
                <user-search @close="show = false"></user-search>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" flat @click="show = false">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import UserSearch from "../dashboard-users/UserSearch";

    export default {
        components: {UserSearch},
        props: {
            value: Boolean
        },
        computed: {
            show: {
                get() {
                    return this.value
                },
                set(value) {
                    this.$emit('input', value)
                }
            }
        },
        methods: {
            onClose(user) {
                console.log("user selected", user);
            }
        }
    }
</script>
