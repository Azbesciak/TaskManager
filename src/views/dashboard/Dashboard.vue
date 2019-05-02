<template>
    <div>{{id}} {{name}}</div>
</template>
<script>
    import {mapGetters} from "vuex";

    export default {
        created() {
            this.$store.dispatch("selectDashboard", this.id)
        },
        data() {
            const {id, name} = this.$route.params;
            return {id, name};
        },
        computed: mapGetters(['dashboard'])
    }
</script>
