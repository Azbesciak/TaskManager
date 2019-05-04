<template>
    <v-flex>
        <create-dashboard ref="createDashboard" :value="''" :loading="loading" :rules="nameRules"
                          :title="'New dashboard group'" @create="addDashboardGroup"
        ></create-dashboard>
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
        data() {
            return {
                isAddEnabled: false,
                nameRules: [v => {
                    if (!this.dashboard) return true;
                    return !Object.keys(this.dashboard).some(({name}) => name === v) || 'Name exists';
                }]
            };
        },
        components: {DashboardGroup},
        computed: mapGetters(['dashboard', 'loading']),
        methods: {
            addDashboardGroup(name) {
                if (!name) return;
                this.$store
                    .dispatch('addDashboardGroup', name)
                    .then(() => this.$refs.createDashboard.reset());
            }
        }
    }
</script>

<style scoped>

</style>
