<template>
    <v-container grid-list-md text-xs-center>
        <v-layout>
            <dashboard-users :dashboard-id="id"></dashboard-users>
            <dashboard-view :dashboard-id="id" :dashboard-name="name"></dashboard-view>
        </v-layout>
    </v-container>
</template>
<script>
    import {mapGetters} from "vuex";
    import DashboardUsers from "../dashboard-users/DashboardUsers";
    import DashboardView from "./DashboardView";

    export default {
        created() {
            this.selectDashboard();
        },
        beforeRouteUpdate(to, from, next) {
            this.id = to.params.id;
            this.name = to.params.name;
            this.selectDashboard();
            next();
        },
        data() {
            const {id, name} = this.$route.params;
            return {id, name};
        },
        components: {DashboardView, DashboardUsers},
        computed: mapGetters(['dashboard', 'loading']),
        methods: {
            selectDashboard() {
                return this.$store.dispatch("selectDashboard", this.id);
            }
        }
    }
</script>
