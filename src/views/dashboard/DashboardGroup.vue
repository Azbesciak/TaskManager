<template>
    <v-card class="mx-auto" :color="group && group.color" max-width="400">
        <v-card-title>
            <template v-if="edit">
                <edit-group :group="newGroup" @finished="onEditFinish"></edit-group>
            </template>
            <template v-else>
                <v-flex>
                    <div class="title font-weight-light" @click.stop="startEdit">{{group.name}}</div>
                </v-flex>
                <v-btn icon flat @click.stop="startEdit">
                    <v-icon>edit</v-icon>
                </v-btn>
            </template>
        </v-card-title>
        <v-card-actions>
            <v-list-tile class="grow">
            </v-list-tile>
        </v-card-actions>
    </v-card>
</template>
<script>
    import EditGroup from "./EditGroup";

    export default {
        components: {EditGroup},
        props: {
            group: null,
            groupId: ''
        },
        data() {
            return {
                edit: !this.group,
                newGroup: null
            }
        },
        methods: {
            startEdit() {
                this.newGroup = Object.assign({groupId: this.groupId}, this.group);
                this.edit = true;
            },
            onEditFinish() {
                this.edit = false;
            }
        }
    }
</script>
<style lang="scss">
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
