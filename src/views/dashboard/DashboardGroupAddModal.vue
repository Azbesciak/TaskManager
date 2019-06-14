<template>
    <v-dialog v-model="show" max-width="500px" persistent>
        <v-card>
            <v-card-title class="headline">Create Item</v-card-title>
            <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="createNew">
                    <v-layout row wrap align-center>
                        <v-flex>
                            <v-text-field
                                    name="name" label="Item name" id="name"
                                    v-model="name" autocomplete="off"
                                    :single-line="true"
                                    :hide-details="true"
                                    type="text" required :rules="nameRules">

                            </v-text-field>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" flat @click="hide">Cancel</v-btn>
                <v-btn color="green darken-1" flat @click="addDashboardGroup">Create</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        props: {
            value: Boolean
        },
        data() {
            return {
                valid: null,
                name: null,
                isAddEnabled: false,
                nameRules: [v => {
                    if (!this.dashboard) return true;
                    return !Object.keys(this.dashboard).some(({name}) => name === v) || 'Name exists';
                }]
            };
        },
        computed: {
            ...mapGetters(['loading', "dashboard"]),
            show: {
                get() {
                    return this.value
                },
                set(value) {
                    this.$emit('close', value)
                }
            },
        },
        methods: {
            addDashboardGroup() {
                if (!this.name) return;
                this.$store
                    .dispatch('addDashboardGroup', this.name)
                    .then(() => {
                        this.name = null;
                        this.hide();
                    })
            },
            hide() {
                this.show = false;
            }
        }
    }
</script>
