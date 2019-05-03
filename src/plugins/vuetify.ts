import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'vuetify/src/stylus/app.styl';
import '@fortawesome/fontawesome-free/css/all.css';
import colors from 'vuetify/es5/util/colors';

Vue.use(Vuetify, {
    iconfont: 'md' || 'fa',
});

export function randomColor() {
    const availableColors = Object.values(colors);
    const colorIndex = Math.floor(Math.random() * availableColors.length);
    return (availableColors[colorIndex] as any).lighten1;
}
