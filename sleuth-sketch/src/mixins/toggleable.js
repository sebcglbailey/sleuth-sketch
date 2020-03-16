import dom from './dom';

export default {
    data() {
        return {
            toggleable_active: false,
            toggleable_closeOnBodyClick: false,
            toggleable_boundCloseListener: null,
            toggleable_disableToggleableClose: false,
            toggleable_disableBodyClick: false,
        };
    },

    mixins: [dom],

    mounted() {
        if (this.toggleable_closeOnBodyClick && !this.toggleable_boundCloseListener) {
            this.toggleable_boundCloseListener = this.toggleable_closeOnOutsideClick;
        } else if (this.toggleable_disableBodyClick) {
            this.toggleable_boundCloseListener = this.toggleable_outsideClick;
        }
    },

    beforeDestroy() {
        this.toggleable_setBoundCloseListener(false);
        this.toggleable_boundCloseListener = null;
    },

    watch: {
        toggleable_active(value) {
            this.toggleable_setBoundCloseListener(value);
        },
    },

    methods: {
        toggleable_close(closeEvent) {
            if (this.toggleable_active) {
                this.toggleable_active = false;
                this.toggleable_setBoundCloseListener();

                const emitEvent = typeof closeEvent === 'string' ? closeEvent : 'close';

                this.$emit(emitEvent);

                if (typeof this.onClose === 'function') {
                    this.onClose();
                }
            }
        },

        toggleable_setBoundCloseListener(enable) {
            const listener = enable ? 'addEventListener' : 'removeEventListener';

            if (this.toggleable_boundCloseListener && (!enable || !this.toggleable_disableToggleableClose)) {
                if (this.dom_isTouchDevice) {
                    this[`window_${listener}`]('touchend', this.toggleable_boundCloseListener, true);
                }

                this[`window_${listener}`]('click', this.toggleable_boundCloseListener, true);
            }
        },

        toggleable_closeOnOutsideClick(e) {
            if (!this.dom_clickedTarget(e, this.$el)) {
                this.toggleable_close();

                if (typeof this.clickOutside === 'function') {
                    this.clickOutside();
                }
            }
        },

        toggleable_outsideClick(e) {
            if (!this.dom_clickedTarget(e, this.$el)) {
                e.stopPropagation();
                e.preventDefault();
            }
        },

        toggleable_open() {
            this.toggleable_active = true;

            if (typeof this.onOpen === 'function') {
                this.onOpen();
            }
        },

        toggleable_toggle() {
            if (!this.toggleable_active) {
                this.toggleable_open();
            } else {
                this.toggleable_close();
            }
        },

        toggleable_tryToggle() {
            if (!this.disabled) {
                this.toggleable_toggle();
            }
        },
    },
};
