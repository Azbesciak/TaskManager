<template>
    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="createNew">
        <v-layout row wrap align-center>
            <v-flex>
                <v-text-field
                        name="name" :label="title" id="name"
                        v-model="name" autocomplete="off"
                        :single-line="isSingle"
                        :hide-details="isHideDetails"
                        type="text" required :rules="nameRules">

                </v-text-field>
            </v-flex>
            <v-btn flat icon small class="text-xs-center align-center" type="submit" :disabled="loading || !valid"
                   :loading="loading">
                <v-icon>add</v-icon>
                <span slot="loader" class="custom-loader">
                    <v-icon light>cached</v-icon>
                </span>
            </v-btn>
        </v-layout>
    </v-form>
</template>

<script>
    export default {
        props: ['value', 'rules', 'loading', 'title', 'isSingle', 'isFullWidth', 'isHideDetails'],
        watch: {
            value(val) {
                this.reset(val)
            }
        },
        data() {
            return {
                valid: false,
                name: this.value,
                nameRules: [v => !!v || "Name must be set", ...(this.rules || [])]
            }
        },
        methods: {
            reset(value = this.value) {
                this.name = value;
                this.$refs.form.resetValidation();
            },
            createNew() {
                if (!this.$refs.form.validate()) return;
                this.$emit('create', this.name);
            }
        }
    }
</script>
<style scoped>
    .v-input--hide-details {
        padding: 0;
        margin: 0;
    }
</style>
