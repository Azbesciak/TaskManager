<template>
    <v-container>
        <v-layout row v-if="error">
            <v-flex xs12 sm6 offset-sm3>
                <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
            </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
                <v-card>
                    <v-card-text>
                        <v-container>
                            <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSignin">
                                <v-text-field
                                        prepend-icon="person" name="email" label="Email" id="email"
                                        v-model="user.email" type="email"
                                        required :rules="rules.email"></v-text-field>
                                <v-text-field
                                        prepend-icon="lock" name="password" label="Password" id="password"
                                        v-model="user.password"
                                        type="password" required :rules="rules.password"></v-text-field>
                                <div class="text-xs-center">
                                    <v-btn type="submit" :disabled="loading || !valid" :loading="loading">
                                        Sign in
                                        <v-icon right>lock_open</v-icon>
                                        <span slot="loader" class="custom-loader">
                                            <v-icon light>cached</v-icon>
                                        </span>
                                    </v-btn>
                                </div>
                                <div class="text-xs-center">
                                    <v-btn color="red" dark :disabled="loading" :loading="loading"
                                           @click.prevent="onSigninGoogle">Login with Google
                                        <v-icon right>fab fa-google</v-icon>
                                        <span slot="loader" class="custom-loader">
                                            <v-icon light>cached</v-icon>
                                        </span>
                                    </v-btn>
                                </div>
                                <div class="text-xs-center">Don't have an account?
                                    <router-link to="/signup">Create one</router-link>
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
    import firebase from 'firebase';
    import {mapGetters} from "vuex";
    import {emailRules, passwordRules} from "./input-rules";
    import store from "../store/store";

    export default {
        name: 'login',
        activated() {
            this.onDismissed()
        },
        data() {
            return {
                user: {
                    email: '',
                    password: '',
                },
                rules: {
                    email: emailRules,
                    password: passwordRules,
                },
                valid: false,
            }
        },
        computed: mapGetters(["error", "loading"]),
        methods: {
            onSignin() {
                if (this.$refs.form.validate()) {
                    this.$store.dispatch('loginUser', this.user);
                }
            },
            onSigninGoogle() {
                const provider = new firebase.auth.GoogleAuthProvider();
                this.$store.dispatch("loginOAuth", {provider})
            },
            onDismissed() {
                this.$store.dispatch('clearError')
            }
        }
    }
</script>
