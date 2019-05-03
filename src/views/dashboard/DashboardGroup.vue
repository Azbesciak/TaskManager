<template>
    <v-card class="mx-auto" :color="group && group.color" max-width="400">
        <v-card-title>
            <template v-if="edit">
                <edit-group :group="group" :group-id="groupId" @finished="onEditFinish"></edit-group>
            </template>
            <template v-else>
                <v-flex>
                    <div class="title font-weight-light" @click.stop="startEdit">
                        {{group.name}}
                    </div>
                </v-flex>
                <v-btn icon flat small @click.stop="startEdit">
                    <v-icon>edit</v-icon>
                </v-btn>
                <task-group-settings :settings="groupSettings" @saved="onSettingsUpdated"></task-group-settings>
            </template>
        </v-card-title>
        <v-card-actions>
            <tasks-view :group="group" :group-id="groupId" :show-completed="groupSettings.completed"></tasks-view>
        </v-card-actions>
    </v-card>
</template>
<script>
    import EditGroup from "./EditGroup";
    import TasksView from "./TasksView";
    import TaskGroupSettings from "./TaskGroupSettings";

    export default {
        components: {TaskGroupSettings, TasksView, EditGroup},
        props: {
            group: null,
            groupId: ''
        },
        data() {
            return {
                edit: !this.group,
                groupSettings: {
                    completed: false,
                    dark: false,
                    groupId: this.groupId
                },
            }
        },
        methods: {
            startEdit() {
                this.edit = true;
            },
            onEditFinish() {
                this.edit = false;
            },
            onSettingsUpdated(newSettings) {
                console.log("NES", newSettings, this.groupSettings)
            }
        }
    }
</script>
<style lang="scss">
    .v-card__title {
        padding: 2px;
    }
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
