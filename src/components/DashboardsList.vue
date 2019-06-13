<template>
    <v-list subheader>
        <v-subheader @click="goToDashboards()" v-bind:class="{navigable: navigable}">Your Dashboards</v-subheader>
        <v-divider v-bind:class="{'navigable-divider':navigable}"></v-divider>
        <v-list-tile
                v-for="value in userDashboards"
                :key="value.id"
                @click="goToDashboard(value.id, value.name)"
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
            ...mapGetters(["userDashboards"])
        },
        methods: {
            goToDashboard(id, name) {
                goToDashboard(id, name)
            },
            goToDashboards() {
                console.log("IS NAVIGABLE", this.navigable)
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
</style>
