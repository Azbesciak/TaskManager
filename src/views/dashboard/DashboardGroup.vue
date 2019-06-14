<template>
    <v-card class="mx-auto"
            :color="color" max-width="400"
            :dark="dark" id="dashboard-group-card">
        <v-card-title>
            <template v-if="nameEdit">
                <dashboard-group-name-edit
                        :group="group" :group-id="groupId"
                        @finished="onNameEditFinish"
                ></dashboard-group-name-edit>
            </template>
            <template v-else>
                <v-flex>
                    <div class="title font-weight-light" @click.stop="startEditName">
                        {{group.name}}
                    </div>
                </v-flex>
                <v-btn icon flat small @click.stop="startEditName">
                    <v-icon>edit</v-icon>
                </v-btn>
                <task-group-settings
                        :settings="tempSettings"
                        :group-id="groupId"
                        @edit-start="startEditSettings"
                        @edit-end="finishSettingsEdit"
                ></task-group-settings>
            </template>
        </v-card-title>
        <v-card-actions>
            <tasks-view
                    :group="group"
                    :group-id="groupId"
                    :show-completed="completed"
            ></tasks-view>
        </v-card-actions>
    </v-card>
</template>
<script>
    import DashboardGroupNameEdit from "./DashboardGroupNameEdit";
    import TasksView from "./TasksView";
    import TaskGroupSettings from "./TaskGroupSettings";

    export default {
        components: {TaskGroupSettings, TasksView, DashboardGroupNameEdit},
        props: {
            group: null,
            groupId: ''
        },
        data() {
            return {
                nameEdit: false,
                tempSettings: null,
            }
        },
        computed: {
            color() {
                return this.tempOrGroup('color')
            },
            dark() {
                return this.tempOrGroup('dark')
            },
            completed() {
                return this.tempOrGroup('completed')
            }
        },
        methods: {
            startEditName() {
                this.nameEdit = true;
            },
            onNameEditFinish() {
                this.nameEdit = false;
            },
            startEditSettings() {
                this.tempSettings = Object.assign({}, this.group.settings);
            },
            finishSettingsEdit() {
                this.tempSettings = null;
            },
            tempOrGroup(name) {
                if (this.tempSettings)
                    return this.tempSettings[name];
                if (this.group && this.group.settings)
                    return this.group.settings[name];
            }
        }
    }
</script>
<style lang="scss">
    #dashboard-group-card {
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
    }

</style>
