<template>
    <v-container grid-list-md  text-xs-center>
        <dashboard-users-list :dashboard-id="id"></dashboard-users-list>
        <dashboard-view :dashboard-id="id" :dashboard-name="name"></dashboard-view>
        <dashboard-actions-button></dashboard-actions-button>
    </v-container>
</template>
<script>
    import {mapGetters} from "vuex";
    import DashboardView from "./DashboardView";
    import DashboardActionsButton from "./DashboardActionsButton";
    import DashboardUsersList from "../dashboard-users/DashboardUsersList";

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
        components: {DashboardUsersList, DashboardActionsButton, DashboardView},
        computed: mapGetters(['dashboard', 'loading']),
        methods: {
            selectDashboard() {
                return this.$store.dispatch("selectDashboard", this.id);
            }
        }
    }
</script>
