import {set, toggle} from "@/store/storeUtils";

export const appStore = {
    mutations: {
        setDrawer: set("drawer"),
        setImage: set("image"),
        setColor: set("color"),
        toggleDrawer: toggle("drawer")
    },
    state: {
        drawer: null,
        color: "success",
        image: "https://demos.creative-tim.com/vue-material-dashboard/img/sidebar-2.32103624.jpg",
        sidebarBackgroundColor: "rgba(27, 27, 27, 0.74)"
    },
    getters: {
        color: state => state.color,
        image: state => state.image,
        sidebarBackgroundColor: state => state.sidebarBackgroundColor
    }
};
