<template>
    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="saveChanges"
            class="full-width title font-weight-light">
        <v-layout row wrap align-center>
            <v-flex>
                <v-text-field
                        label="Name" v-model="name" single-line full-width
                        hide-details :rules="nameRules" class="text-xs-center edit-input"></v-text-field>
            </v-flex>
            <v-btn icon flat small type="submit" :loading="loading" :disabled="loading || !valid">
                <v-icon>save</v-icon>
                <span slot="loader" class="custom-loader">
                                <v-icon light>cached</v-icon>
                            </span>
            </v-btn>
            <v-btn icon flat small @click.stop="finish">
                <v-icon>undo</v-icon>
            </v-btn>
        </v-layout>
    </v-form>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "DashboardGroupNameEdit",
        props: ['group', 'group-id'],
        data() {
            return {
                valid: false,
                name: this.group.name,
                nameRules: [
                    v => !!v || "Name cannot be empty",
                    v => v.length <= 20 || "Name must be no longer than 20 characters"
                ]
            }
        },
        computed: mapGetters(["loading"]),
        methods: {
            saveChanges() {
                if (this.group.name !== this.name)
                    this.$store.dispatch('updateDashboardGroup', {
                        groupId: this.groupId,
                        name: this.name
                    }).then(() => this.finish());
                else
                    this.finish()
            },
            finish() {
                this.$emit('finished')
            }
        }
    }
</script>
<style lang="scss">
    .edit-input {
        .v-input__slot {
            min-height: 40px !important;
        }

        input {
            max-height: 40px;
            margin-top: 0 !important;
        }

    }
</style>

