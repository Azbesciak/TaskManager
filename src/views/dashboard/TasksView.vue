<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-flex row wrap xs12>
        <v-flex>
            <create-dashboard ref="createTask" :value="''" :loading="loading" :rules="taskNameRules"
                              :title="'New Task...'" @create="createNewTask" :is-single="true" :is-hide-details="true" :is-full-width="true"
            ></create-dashboard>
        </v-flex>
        <v-flex xs12 pa-0>
            <v-expansion-panel popout pt-5>
                <v-expansion-panel-content
                        v-for="[taskId, task] in visibleTasks"
                        :key="taskId"
                >
                    <template v-slot:header>
                        <div>{{task.taskName}}</div>
                    </template>
                    <v-card>
                        <v-card-text v-if="task.description">{{task.description}}</v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn icon flat @click.stop="completeTask(taskId)" :disabled="task.completed">
                                <v-icon>done</v-icon>
                            </v-btn>
                            <v-btn icon flat>
                                <v-icon>edit</v-icon>
                            </v-btn>
                            <v-btn icon flat @click.stop="removeTask(taskId)">
                                <v-icon>clear</v-icon>
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
                taskNameRules: [v => !!v || "Task name required"]
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
            completeTask(taskId) {
                this.dispatch('completeTask', {taskId});
            },
            dispatch(funcName, payload) {
                return this.$store
                    .dispatch(funcName, {...payload, groupId: this.groupId});
            }
        }
    }
</script>

<style scoped>

</style>
