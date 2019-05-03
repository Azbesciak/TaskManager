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
            <v-card>
                <v-list>
                    <v-list-tile>
                        <v-list-tile-action>
                            <v-switch v-model="settings.completed" color="purple"></v-switch>
                        </v-list-tile-action>
                        <v-list-tile-title>Show completed tasks</v-list-tile-title>
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
            settings: {}
        },
        data() {
            return {
                visible: false
            }
        },
        methods: {
            removeGroup() {
                this.visible = false;
                this.$store.dispatch("removeDashboardGroup", this.settings.groupId)
            },
            saveSettings() {
                this.visible = false;
                this.$emit('saved', this.settings)
            }
        }
    }
</script>

<style scoped>

</style>
