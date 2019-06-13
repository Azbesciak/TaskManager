<template>
    <v-app>
        <core-toolbar/>
        <core-drawer/>
        <error-alert></error-alert>
        <core-view/>
    </v-app>
</template>

<script>
    import View from "./components/core/View";
    import Drawer from "./components/core/Drawer";
    import Toolbar from "./components/core/Toolbar";

    export default {
        components: {
            'core-view': View,
            'core-drawer': Drawer,
            'core-toolbar': Toolbar
        }
    }
</script>
<style lang="scss">
    @import '@/styles/index.scss';
    /* Remove in 1.2 */
    .v-datatable thead th.column.sortable i {
        vertical-align: unset;
    }

    .custom-loader {
        animation: loader 1s infinite;
        display: flex;
    }

    @-moz-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @-webkit-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @-o-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>
