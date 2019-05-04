<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-flex row wrap xs12>
        <v-flex>
            <create-dashboard ref="createTask" :value="''" :loading="loading" :rules="taskNameRules"
                              :title="'New Task...'" @create="createNewTask" :is-single="true" :is-hide-details="true"
                              :is-full-width="true"
            ></create-dashboard>
        </v-flex>
        <v-flex xs12 pa-0>
            <v-expansion-panel popout pt-5 class="task-panel">
                <v-expansion-panel-content v-bind:class="{'completed-task': task.completed}"
                                           v-for="[taskId, task] in visibleTasks"
                                           :key="taskId"
                >
                    <template v-slot:header>
                        <v-layout row wrap>
                            <v-flex>
                                <div class="header-text">{{task.taskName}}</div>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-btn icon flat small
                                   class="header-activate"
                                   @click.stop="completeTask(taskId, true)"
                                   :disabled="task.completed">
                                <v-icon>done</v-icon>
                            </v-btn>
                        </v-layout>
                    </template>
                    <v-card>
                        <v-card-text v-if="task.description">{{task.description}}</v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn icon small flat @click.stop="completeTask(taskId, !task.completed)">
                                <v-icon v-if="task.completed">clear</v-icon>
                                <v-icon v-else>done</v-icon>
                            </v-btn>
                            <v-btn icon flat small>
                                <v-icon>edit</v-icon>
                            </v-btn>
                            <v-btn icon flat small @click.stop="removeTask(taskId)">
                                <v-icon>delete</v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-flex>
    </v-flex>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "TasksView",
        props: ['group', 'group-id', 'showCompleted'],
        data() {
            return {
                taskNameRules: [v => !!v || "Task name required"],
            }
        },
        computed: {
            ...mapGetters(['loading']),
            visibleTasks() {
                if (!this.group || !this.group.tasks) return [];
                return Object.entries(this.group.tasks).filter(([, v]) => !v.completed || this.showCompleted)
            }
        },
        methods: {
            createNewTask(taskName) {
                this.dispatch('addTask', {taskName})
                    .then(() => this.$refs.createTask.reset());
            },
            removeTask(taskId) {
                this.dispatch('removeTask', {taskId});
            },
            completeTask(taskId, completed) {
                this.dispatch('completeTask', {taskId, completed});
            },
            dispatch(funcName, payload) {
                return this.$store
                    .dispatch(funcName, {...payload, groupId: this.groupId});
            }
        }
    }
</script>

<style lang="scss">
    .task-panel {
        .v-expansion-panel__header {
            padding: 12px;
        }
        .completed-task .v-expansion-panel__header {
            color: rgba(59, 94, 40, 0.9);
            font-weight: 500;
        }
        &.theme--dark .completed-task .v-expansion-panel__header{
            color: rgba(124, 196, 79, 0.9);
        }
    }

    .header-text {
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-word;
        max-width: 270px;
    }

    .header-activate {
        align-self: center;
        margin-right: 4px;
    }

    .v-expansion-panel__container--active {
        .header-text {
            max-width: initial;
        }

        .header-activate {
            display: none;
        }
    }
</style>
