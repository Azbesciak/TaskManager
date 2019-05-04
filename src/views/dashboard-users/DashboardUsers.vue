<template>
    <div>
        <user-search :dashboard-id="dashboardId"></user-search>
        <dashboard-users-list :dashboard-id="dashboardId"></dashboard-users-list>
    </div>
</template>

<script>
    import UserSearch from "./UserSearch";
    import DashboardUsersList from "./DashboardUsersList";
    export default {
        name: "DashboardUsers",
        components: {DashboardUsersList, UserSearch},
        props: ['dashboardId']
    }
</script>

<style scoped>

</style>
