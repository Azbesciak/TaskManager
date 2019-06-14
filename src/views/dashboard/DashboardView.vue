<template>
    <v-flex>
        <v-layout wrap>
            <v-flex v-for="(group, id) in dashboard && dashboard.groups">
                <dashboard-group :group="group" :group-id="id"></dashboard-group>
            </v-flex>
        </v-layout>
    </v-flex>
</template>

<script>
    import {mapGetters} from "vuex";
    import DashboardGroup from "./DashboardGroup";

    export default {
        name: "DashboardView",
        props: ['dashboardId', 'dashboardName'],
        components: {DashboardGroup},
        computed: mapGetters(['dashboard']),
    }
</script>

<style scoped>

</style>
