<template>
    <v-list-tile>
        <v-list-tile-avatar v-if="user.photoUrl">
            <img :src="user.photoUrl">
        </v-list-tile-avatar>
        <v-list-tile-avatar v-else
                            color="indigo"
                            class="headline font-weight-light white--text"
        >
            {{ (user.name || user.email).charAt(0) }}
        </v-list-tile-avatar>
        <v-list-tile-content>
            <v-list-tile-title v-text="user.name || user.email"></v-list-tile-title>
            <v-list-tile-sub-title v-if="user.name && user.email">{{user.email}}</v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action v-if="$slots.default">
            <slot></slot>
        </v-list-tile-action>
    </v-list-tile>
</template>

<script>
    export default {
        name: "UserSnapshot",
        props: ['user']
    }
</script>

<style scoped>

</style>
