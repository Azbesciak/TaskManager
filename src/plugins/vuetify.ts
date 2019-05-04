import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'vuetify/src/stylus/app.styl';
import 'vue-swatches/dist/vue-swatches.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import colors from 'vuetify/es5/util/colors';

Vue.use(Vuetify, {
    iconfont: 'md' || 'fa',
});

export const materialColors = getColors();

export function getColors() {
    const availableColors = Object.values(colors);
    const lightColors = availableColors.map(c => (c as any).base).filter(v => v);
    return [...lightColors, ''];
}

export function randomColor() {
    const colorIndex = Math.floor(Math.random() * materialColors.length);
    return materialColors[colorIndex];
}
