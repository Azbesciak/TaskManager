<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="text-xs-center">
        <v-menu
                v-model="visible"
                :close-on-content-click="false"
                :nudge-width="200"
                offset-x
        >
            <template v-slot:activator="{ on }">
                <v-btn icon flat v-on="on" small>
                    <v-icon>more_vert</v-icon>
                </v-btn>
            </template>
            <v-card v-if="settings">
                <v-list>
                    <v-list-tile>
                        <v-list-tile-action>
                            <v-switch v-model="settings.completed" color="purple"></v-switch>
                        </v-list-tile-action>
                        <v-list-tile-title>Show completed tasks</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile>
                        <v-list-tile-action>
                            <v-switch v-model="settings.dark" color="purple"></v-switch>
                        </v-list-tile-action>
                        <v-list-tile-title>Dark Mode</v-list-tile-title>
                    </v-list-tile>
                </v-list>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" flat @click.stop="removeGroup">Remove</v-btn>
                    <v-btn flat @click.stop="visible = false">Cancel</v-btn>
                    <v-btn color="primary" flat @click="saveSettings">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-menu>
    </div>
</template>

<script>
    export default {
        name: "TaskGroupSettings",
        props: {
            settings: {},
            groupId: null
        },
        data() {
            return {
                visible: false,
                original: null
            }
        },
        watch: {
            visible(value) {
                if (value)
                    this.$emit("edit-start");
                else
                    this.$emit("edit-end");
            },
            settings(newValue, old) {
                if (!old && newValue) {
                    this.original = Object.assign({}, newValue)
                } else if (!newValue && old) {
                    this.original = null
                }
            }
        },
        methods: {
            removeGroup() {
                this.finish();
                this.$store.dispatch("removeDashboardGroup", this.groupId)
            },
            saveSettings() {
                const changed = Object.entries(this.settings)
                    .some(([k, v]) => typeof v == 'boolean' ? v === !this.original[k] : v !== this.original[k]);
                if (changed)
                    this.$store.dispatch('updateDashboardGroup', {
                        groupId: this.groupId,
                        settings: this.settings
                    }).then(() => this.finish());
                else
                    this.finish()

            },
            finish() {
                this.visible = false;
            }
        }
    }
</script>

<style scoped>

</style>
