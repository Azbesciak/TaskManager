<template>
    <v-container>
        <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
                <v-card>
                    <v-card-text>
                        <v-container>
                            <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="signUp">
                                <v-text-field
                                        prepend-icon="person" name="email" label="Email" id="email"
                                        v-model="user.email" type="email" :rules="rules.email"
                                        required></v-text-field>
                                <v-text-field
                                        prepend-icon="lock" name="password" label="Password" id="password"
                                        v-model="user.password" :rules="rules.password"
                                        type="password" required></v-text-field>
                                <v-text-field
                                        prepend-icon="lock" name="passwordRepeat" label="PasswordRepeat"
                                        id="passwordRepeat"
                                        type="password" required v-model="user.passwordRepeat"
                                        :rules="rules.passwordRepeat"></v-text-field>
                                <div class="text-xs-center">
                                    <v-btn type="submit" :disabled="loading || !valid || !valuesSet" :loading="loading">
                                        Sign up
                                        <v-icon right>lock_open</v-icon>
                                        <span slot="loader" class="custom-loader">
                                            <v-icon light>cached</v-icon>
                                        </span>
                                    </v-btn>
                                </div>
                                <div class="text-xs-center">Go to
                                    <router-link to="/signin">Sign In</router-link>
                                </div>
                            </v-form>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
    import {emailRules, passwordRules} from "./input-rules";
    import {mapGetters} from "vuex";

    export default {
        name: 'signUp',
        data() {
            return {
                valid: false,
                user: {
                    email: '',
                    password: '',
                    passwordRepeat: '',
                },
                rules: {
                    email: emailRules,
                    password: passwordRules,
                    passwordRepeat: [
                        v => !v || v === this.user.password || 'Repeated password must be the same'
                    ]
                }
            };
        },
        computed: {
            ...mapGetters(['loading']),
            valuesSet() {
                return this.user.email && this.user.password && this.user.passwordRepeat
            }
        },
        methods: {
            signUp() {
                if (this.$refs.form.validate()) {
                    this.$store.dispatch("signUpUser", this.user)
                }
            }
        }
    }
</script>

