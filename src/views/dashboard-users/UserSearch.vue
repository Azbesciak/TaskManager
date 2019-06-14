<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-form @submit.stop.prevent="searchUser">
        <v-autocomplete
                ref="searchInput"
                v-model="select"
                :loading="loading"
                :items="items"
                :search-input.sync="search"
                class="mx-3 user-search"
                flat
                :menu-props="{openOnClick: true}"
                hide-details
                append-icon="search"
                label="User email"
        >
            <template v-slot:no-data>
                <v-list-tile>
                    <v-list-tile-title>
                        No results
                    </v-list-tile-title>
                </v-list-tile>
            </template>
            <template v-slot:item="{ item }">
               <user-snapshot class="user-result" :user="item"></user-snapshot>
            </template>
        </v-autocomplete>
    </v-form>
</template>

<script>

    import {queryUser} from "../../firebase/user";
    import {mapGetters} from "vuex";

    export default {
        name: "UserSearch",
        data() {
            return {
                loading: false,
                items: [],
                search: null,
                select: null
            }
        },
        watch: {
            select(user) {
                if (user && typeof user === 'object') {
                    this.$store.dispatch("sendDashboardInvitation", {
                        user,
                        dashboardId: this.dashboard.id
                    });
                    this.items = [];
                    this.$refs.searchInput.reset();
                    this.value = null;
                    this.$emit("close")
                }
            }
        },
        computed: mapGetters(["dashboard"]),
        methods: {
            searchUser() {
                this.loading = true;
                queryUser(this.search)
                    .then(r => {
                        this.items = r;
                        this.loading = false;
                        this.$refs.searchInput.reset();
                        this.select = this.search;
                    })
                    .catch(e => {
                        this.items = [];
                        this.loading = false
                    })
            }
        }
    }
</script>

<style>
    .v-expansion-panel__header {
        padding: 2px 18px;
        min-height: 36px;
    }
    .user-search.v-select.v-select--is-menu-active .v-icon {
        transform: none;
    }
    .user-result .v-list__tile {
        padding: 0 !important;
    }
</style>
