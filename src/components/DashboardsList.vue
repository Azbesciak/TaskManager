<template>
    <v-list subheader>
        <v-subheader>Your Dashboards</v-subheader>
        <v-divider></v-divider>
        <v-list-tile
                v-for="(value, key) in user.dashboards"
                :key="key"
                @click="goToDashboard(key, value.name)"
        >
            <v-list-tile-content>
                <v-list-tile-title v-html="value.name"></v-list-tile-title>
            </v-list-tile-content>
            <v-btn icon flat small v-if="canRemove" @click.stop="removeDashboard(key)">
                <v-icon>clear</v-icon>
            </v-btn>
        </v-list-tile>
    </v-list>
</template>
<script>
    import {mapGetters} from "vuex";
    import {goToDashboard} from "../router";

    export default {
        props: {
          canRemove: false
        },
        data: () => ({
            createDashboardEnabled: false
        }),
        computed: {
            ...mapGetters(["user"])
        },
        methods: {
            goToDashboard(id, name) {
                goToDashboard(id, name)
            },
            removeDashboard(id) {
                this.$store.dispatch("removeDashboard", id)
            }
        }
    }
</script>
