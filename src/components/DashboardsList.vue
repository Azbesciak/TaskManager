<template>
    <v-list subheader id="dashboards-list">
        <v-subheader @click="goToDashboards()" v-bind:class="{navigable: navigable}">Your Dashboards</v-subheader>
        <v-divider v-bind:class="{'navigable-divider':navigable}"></v-divider>
        <v-list-tile
                v-bind:class="{'success v-list__tile--active': dashboard && value.name == dashboard.name}"
                v-for="value in userDashboards"
                :key="value.id"
                @click="goToDashboard(value.id, value.name)"
        >
            <v-list-tile-content>
                <v-list-tile-title v-html="value.name" class="dashboard-list-position"></v-list-tile-title>
            </v-list-tile-content>
            <v-btn icon flat small v-if="canRemove" @click.stop="removeDashboard(key)">
                <v-icon>clear</v-icon>
            </v-btn>
        </v-list-tile>
    </v-list>
</template>
<script>
    import {mapGetters} from "vuex";
    import {goToDashboard, goToDashboards} from "../router";

    export default {
        props: {
            canRemove: false,
            navigable: false
        },
        data: () => ({
            createDashboardEnabled: false
        }),
        computed: {
            ...mapGetters(["userDashboards", "dashboard", "color"])
        },
        methods: {
            goToDashboard(id, name) {
                goToDashboard(id, name)
            },
            goToDashboards() {
                if (this.navigable)
                    goToDashboards();
            },
            removeDashboard(id) {
                this.$store.dispatch("removeDashboard", id)
            }
        }
    }
</script>
<style>
    .navigable {
        cursor: pointer;
    }

    .navigable-divider {
        margin: -1px auto 4px !important;
    }

    .v-navigation-drawer .v-list .v-list__tile__title.dashboard-list-position {
        font-size: 15px !important;
    }

    div[role=listitem] {
        border-radius: 4px;
    }
</style>
