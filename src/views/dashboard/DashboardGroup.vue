<template>
    <v-card class="mx-auto" :color="group && group.color" max-width="400">
        <v-card-title>
            <template v-if="edit">
                <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="saveChanges"
                        class="full-width title font-weight-light">
                    <v-layout row wrap align-center>
                        <v-flex>
                            <v-text-field
                                    label="Name" v-model="newGroup.name" single-line full-width
                                    hide-details :rules="nameRules" class="text-xs-center"></v-text-field>
                        </v-flex>
                        <v-btn icon flat type="submit" :loading="loading" :disabled="loading || !valid">
                            <v-icon>save</v-icon>
                            <span slot="loader" class="custom-loader">
                                <v-icon light>cached</v-icon>
                            </span>
                        </v-btn>
                        <v-btn icon flat @click.stop="revert">
                            <v-icon>undo</v-icon>
                        </v-btn>
                    </v-layout>
                </v-form>
            </template>
            <template v-else>
                <v-flex>
                    <div class="title font-weight-light" @click.stop="startEdit">{{group.name}}</div>
                </v-flex>
                <v-btn icon flat @click.stop="startEdit">
                    <v-icon>edit</v-icon>
                </v-btn>
            </template>
        </v-card-title>
        <v-card-actions>
            <v-list-tile class="grow">
            </v-list-tile>
        </v-card-actions>
    </v-card>
</template>
<script>
    import {mapGetters} from "vuex";

    export default {
        props: {
            group: null,
            groupId: ''
        },
        data() {
            return {
                valid: false,
                edit: !this.group,
                newGroup: null,
                nameRules: [
                    v => !!v || "Name cannot be empty",
                    v => v.length <= 20 || "Name must be no longer than 20 characters"
                ]
            }
        },
        computed: {
            ...mapGetters(['loading']),
        },
        methods: {
            startEdit() {
                this.newGroup = Object.assign({}, this.group);
                this.edit = true;
            },
            saveChanges() {
                if (!this.$refs.form.validate()) return;
                const changed = this.group.name !== this.newGroup.name;
                if (changed)
                    this.$store.dispatch('updateDashboardGroup', {groupId: this.groupId, ...this.newGroup})
                        .then(v => this.edit = false);
                else
                    this.edit = false;
            },
            revert() {
                this.edit = false
            }
        }
    }
</script>
<style lang="scss">
    .full-width {
        width: 100%;
        background: rgba(245, 245, 245, 0.21);
        input {
            text-align: center;
            font-size: 20px;
            font-weight: 700;
        }
    }
</style>
