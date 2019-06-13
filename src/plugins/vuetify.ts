import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css'
// import 'vuetify/src/stylus/app.styl';
import 'vue-swatches/dist/vue-swatches.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import colors from 'vuetify/es5/util/colors';

import theme from './theme'
Vue.use(Vuetify, {
    iconfont: 'md' || 'fa',
    theme
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
