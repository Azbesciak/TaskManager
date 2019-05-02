<template>
    <v-container>
        <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
                <v-card>
                    <v-card-text>
                        <create-dashboard></create-dashboard>
                        <dashboards-list></dashboards-list>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
    import CreateDashboard from "./CreateDashboard";
    import DashboardsList from "./DashboardsList";

    export default {
        components: {
            'create-dashboard': CreateDashboard,
            'dashboards-list': DashboardsList
        }
    }
</script>
