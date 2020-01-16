/*
* Mixin to apply window utils to simplify testing
* 1. Import the mixin and add to the component
* 2. Use the mixin methods at your leisure
*/

export default {
    data() {
        return {
            window_window: window,
        };
    },

    created() {
        if (!this.window_window) {
            this.window_window = window;
        }
    },

    methods: {
        /* istanbul ignore next */
        window_getComputedStyle(...args) {
            return window.getComputedStyle(...args);
        },

        /* istanbul ignore next */
        window_addEventListener(...args) {
            return window.addEventListener(...args);
        },

        /* istanbul ignore next */
        window_removeEventListener(...args) {
            return window.removeEventListener(...args);
        },

        /* istanbul ignore next */
        window_scrollTo(xCoord, yCoord) {
            return window.scrollTo(xCoord, yCoord);
        },
    },
};
