<template>
    <div>{{id}} {{name}}</div>
</template>
<script>
    export default {
        data() {
            const {id, name} =  this.$route.params;
            return {id, name};
        }
    }
</script>
