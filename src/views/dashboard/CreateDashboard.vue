<template>
    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="createNew">
        <v-layout row wrap align-center>
            <v-flex>
                <v-text-field
                        name="name" label="Dashboard name" id="dashboard-name"
                        v-model="dashboard.name" autocomplete="off"
                        type="text" required :rules="dashboard.nameRules">
                </v-text-field>
            </v-flex>
            <v-btn class="text-xs-center align-center" type="submit" :disabled="loading || !valid"
                   :loading="loading">
                Create
                <v-icon right>add</v-icon>
                <span slot="loader" class="custom-loader">
                                    <v-icon light>cached</v-icon>
                                </span>
            </v-btn>
        </v-layout>
    </v-form>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        data: () => ({
            valid: false,
            dashboard: {
                name: '',
                nameRules: [v => !!v || "Name must be set"]
            }
        }),
        computed: {
            ...mapGetters(['user', 'loading'])
        },
        methods: {
            createNew() {
                const {form} = this.$refs;
                if (!form.validate()) return;
                this.$store.dispatch('createDashboard', {name: this.dashboard.name}).then(v => {
                    this.dashboard.name = '';
                    form.resetValidation();
                })
            }
        }
    }
</script>
