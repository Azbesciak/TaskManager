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
        </v-list-tile>
    </v-list>
</template>
<script>
    import {mapGetters} from "vuex";
    import {goToDashboard, HOME_PAGE} from "../router";

    export default {
        data: () => ({
            createDashboardEnabled: false
        }),
        computed: {
            ...mapGetters(["user"])
        },
        methods: {
            goToDashboard(id, name) {
                goToDashboard(id, name)
            }
        }
    }
</script>
