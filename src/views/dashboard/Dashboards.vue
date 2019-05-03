<template>
    <v-container>
        <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
                <v-card>
                    <v-card-text>
                        <create-dashboard ref="createDashboard" :value="''" :loading="loading" :rules="nameRules"
                                          :title="'New dashboard name'" @create="onCreateRequest"
                        ></create-dashboard>
                        <dashboards-list :can-remove="true"></dashboards-list>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
    import {mapGetters} from "vuex";

    export default {
        computed: mapGetters(["loading", "user"]),
        data() {
          return {
              nameRules: [v => {
                  if (!this.user || !this.user.dashboards) return true;
                  return !Object.values(this.user.dashboards).some(({name})=> name === v) || 'Name exists';
              }]
          }
        },
        methods: {
            onCreateRequest(value) {
                this.$store
                    .dispatch("createDashboard", {name: value})
                    .then(() => this.$refs.createDashboard.reset());
            }
        }
    };
</script>
