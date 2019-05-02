<template>
    <v-list subheader v-if="user">
        <v-subheader>Your Dashboards</v-subheader>
        <v-list-tile
                v-for="(value, key) in user.dashboards"
                :key="key"
                avatar
                @click=""
        >
            <v-list-tile-content>
                <v-list-tile-title v-html="value.name"></v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
    </v-list>
</template>
<script>
    import {mapGetters} from "vuex";

    export default {
        data: () => ({
            createDashboardEnabled: false
        }),
        computed: {
            ...mapGetters(["user"])
        }
    }
</script>
