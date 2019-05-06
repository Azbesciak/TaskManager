export const notificationsStore = {
    getters: {
        notificationsNumber(state, getters) {
            return getters.userDashboardInvitations.length;
        },
        notifications(state, getters) {
            return {
                invitations: getters.userDashboardInvitations
            }
        }
    }
};
