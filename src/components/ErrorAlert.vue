<template>
    <v-snackbar v-if="error"
            v-model="visible"
            :color="'error'"
            :timeout="timeout"
    >
        {{ error.message }}
        <v-btn dark flat @click="visible = false">
            Close
        </v-btn>
    </v-snackbar>
</template>

<script>
    import {mapGetters} from "vuex";
    const DEFAULT_TIMEOUT = 2000;
    let _snack = false;
    export default {
        created() {
          this.$store.subscribe(mutation => {
              if (mutation.type === 'setError' && mutation.payload) {
                  this.visible = true;
                  this.timeout = DEFAULT_TIMEOUT + mutation.payload.message.length * 40
              }
          })
        },
        data() {
            const store = this.$store;
            return {
                set visible(value) {
                    _snack = value;
                    if (!value)
                        store.commit("clearError")
                },
                get visible() {
                    return _snack;
                },
                timeout: 5000
            }
        },
        computed: mapGetters(['error'])
    }
</script>
