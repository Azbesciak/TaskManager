<template>
    <v-app>
        <header-component></header-component>
        <main>
            <router-view></router-view>
        </main>
    </v-app>
</template>

<script>
    import HeaderComponent from "./components/Header";
    export default {
        components: {
            'header-component': HeaderComponent
        }
    }
</script>
<style>
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
