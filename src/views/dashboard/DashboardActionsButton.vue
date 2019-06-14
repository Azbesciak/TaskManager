<template>
    <v-layout>
        <v-speed-dial
                class="dashboard-actions-button"
                v-model="fab"
                :top="false"
                :bottom="true"
                :right="true"
                :left="false"
                :direction="'top'"
                :open-on-hover="true"
                :transition="'slide-y-reverse-transition'"
        >
            <v-btn
                    slot="activator"
                    color="primary"
                    dark
                    fab
                    hover
                    v-model="fab"
            >
                <v-icon>add</v-icon>
                <v-icon>close</v-icon>
            </v-btn>
            <v-tooltip :disabled="tooltipsDisabled" left :value="tooltips" v-for="b in buttons">
                <v-btn fab dark small :color="b.color" slot="activator" @click="b.onClick()">
                    <v-icon>{{b.icon}}</v-icon>
                </v-btn>
                <span>{{b.label}}</span>
            </v-tooltip>
        </v-speed-dial>
        <DashboardUserAddModal v-model="modals.addUser" @close="modals.addUser = false"></DashboardUserAddModal>

    </v-layout>
</template>

<script>
    import DashboardUserAddModal from "./DashboardUserAddModal";

    export default {
        name: "DashboardActionsButton",
        components: {DashboardUserAddModal},
        props: ['dashboardId'],
        data() {
            const comp = this;
            return {
                fab: false,
                tabs: null,
                tooltips: false,
                modals: {
                    addUser: false,
                    addTask: false
                },
                tooltipsDisabled: false,
                buttons: [
                    {
                        color: 'orange', icon: 'face', label: 'Add user', onClick: () => {
                            comp.modals.addUser = true
                        }
                    },
                    {
                        color: 'indigo', icon: 'add', label: 'Add task', onClick: () => {
                            comp.modals.addTask = true
                        }
                    }
                ]
            }
        },
        watch: {
            fab(val) {
                this.tooltips = false;
                this.tooltipsDisabled = false;
                val && setTimeout(() => {
                    this.tooltips = true;
                    this.$nextTick(() => this.tooltipsDisabled = true)
                }, 250)
            }
        }
    }
</script>

<style>
    /* This is for documentation purposes and will not be needed in your application */
    .v-speed-dial {
        position: absolute;
    }

    .v-btn--floating {
        position: relative;
    }
</style>
