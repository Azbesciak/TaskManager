<template>
    <v-container grid-list-md text-xs-center>
        <create-dashboard ref="createDashboard" :value="''" :loading="loading" :rules="nameRules"
                          :title="'New dashboard group'" @create="addDashboardGroup"
        ></create-dashboard>
        <v-layout wrap>
            <v-flex v-for="(group, id) in dashboard && dashboard.groups">
                <dashboard-group :group="group" :group-id="id"></dashboard-group>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
    import {mapGetters} from "vuex";
    import DashboardGroup from "./DashboardGroup";

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
            return {
                id, name,
                isAddEnabled: false,
                nameRules: [v => {
                    if (!this.dashboard) return true;
                    return !Object.keys(this.dashboard).some(({name}) => name === v) || 'Name exists';
                }]
            };
        },
        components: {
            'dashboard-group': DashboardGroup
        },
        computed: mapGetters(['dashboard', 'loading']),
        methods: {
            addDashboardGroup(name) {
                if (!name) return;
                this.$store
                    .dispatch('addDashboardGroup', name)
                    .then(() => this.$refs.createDashboard.reset());
            },
            selectDashboard() {
                return this.$store.dispatch("selectDashboard", this.id);
            }
        }
    }
</script>
