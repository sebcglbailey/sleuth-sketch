<template>
    <div
        :class="['modal-overlay', computedSize, { open: toggleable_active }]"
        @mousedown="overlayClick"
    >
        <div :class="['modal-dialog', computedSize]">
            <div ref="modalContentWrapper" :class="['modal-content-wrapper']">
                <div
                    :class="['modal-header', {
                        'has-navigation': hasNavigation,
                        sticky: stickyDesktopHeader,
                        'has-title-actions': hasTitleActions,
                    }]"
                    v-if="hasHeader"
                >
                    <section
                        id="close"
                        class="navigation"
                        @click.stop="tryClose"
                    >
                        <button class="icon-only">
                            <icon name="x"/>
                        </button>
                    </section>
                    <slot name="title">
                        <section :class="['text']">
                            <h4 :title="title">{{ title }}</h4>
                            <p v-if="subTitle">{{ subTitle }}</p>
                        </section>
                    </slot>
                </div>

                <div :class="['modal-body', { 'has-header': hasHeader }]">
                    <div class="modal-body-inner">
                        <slot />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import toggleable from '@/mixins/toggleable';
import Icon from '@/components/Icon';

import scrollbarWidth from '@/mixins/scrollbarWidth';

import '@/assets/icons/x.svg';

export default {
    name: 'Modal',

    components: {
        Icon,
    },

    mixins: [toggleable],

    props: {
        title: {
            type: String,
            default: '',
            docdescription: 'The title of the modal',
        },

        subTitle: {
            type: String,
            default: '',
            docdescription: 'A string below the title',
        },

        size: {
            type: String,
            default: null,
            docdescription: 'Determines the size of the modal',
            options: ['xs', 'sm', 'med', 'lg', 'xl', 'fluid', 'fullscreen'],
        },

        stickyDesktopHeader: {
            type: Boolean,
            default: false,
            docdescription: 'Use sticky header on desktop as well as mobile',
        },
    },

    /* documentation:start */
    docevents: [
        {
            name: 'back',
            docdescription: 'When back is selected',
        },
        {
            name: 'close',
            docdescription: 'When close is selected',
        },
    ],
    /* documentation:end */

    data() {
        return {
            titleEdit: this.title,
        };
    },

    beforeDestroy() {
        this.updateActive(false);
    },

    watch: {
        toggleable_active(val) {
            this.updateActive(val);
        },

        title(value) {
            this.titleEdit = value;
        },

        titleEdit(value) {
            this.$emit('update:title', value);
        },
    },

    computed: {
        actionTextDisplay() {
            return this.actionText ? this.actionText : this.$t('global.form.buttons.save');
        },

        hasHeader() {
            return Boolean(this.title) ||
                Boolean(this.showAction) ||
                Boolean(this.showBack) ||
                Boolean(this.showClose);
        },

        hasNavigation() {
            return Boolean(this.showBack) ||
                Boolean(this.showClose);
        },

        computedSize() {
            if (this.size) {
                return this.size;
            }

            return 'med';
        },

        hasTitleActions() {
            return Boolean(this.$slots.title);
        },
    },

    methods: {
        action() {
            if (!this.actionDisabled) {
                this.$emit('action');
            }
        },

        tryClose() {
            if (!this.interceptClose) {
                this.toggleable_close();
            } else {
                this.$emit('close');
            }
        },

        updateActive(active) {
            if (this.$store) {
                this.$store.commit('SET_OVERLAY_ACTIVE', active);
            }

            this.$emit('activeChange', active);
        },

        overlayClick(e) {
            if (
                !this.dom_clickedTarget(e, this.$refs.modalContentWrapper) &&
                document.documentElement.clientWidth - e.pageX > scrollbarWidth()
            ) {
                this.tryClose();
            }
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "@/styles/main.scss";

    @include keyframes(modalSlide) {
        from {
            transform: scale(0.8);
        }

        to {
            transform: scale(1);
        }
    }

    .modal-overlay {
        @include overlay-background;

        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
        outline: 0;
        display: none;

        &.open {
            display: block;

            .modal-content-wrapper {
                @include animation('modalSlide');
            }
        }

        @media($small) {
            background-color: transparent;
        }

        @media($medium) {
            padding-left: $gp;
            padding-right: $gp;

            &.fullscreen {
                padding-left: 0;
                padding-right: 0;
            }
        }
    }

    .modal-dialog {
        @include text-align-start;
        position: relative;
        margin: $gp * 2 auto;
        display: flex;
        min-height: auto;
        max-width: 100%;
        width: var(--modal-width, 100%);

        @media($small) {
            margin: 0 auto;
            min-height: 100%;
        }

        @media($medium) {
            &.xs {
                max-width: $modal-size-xs;
                width: var(--modal-width, #{$modal-size-xs});
            }

            &.sm {
                max-width: $modal-size-sm;
                width: var(--modal-width, #{$modal-size-sm});
            }

            &.med {
                max-width: $modal-size-med;
                width: var(--modal-width, #{$modal-size-med});
            }

            &.fluid {
                max-width: $modal-size-fluid;
                width: var(--modal-width, #{$modal-size-fluid});
            }

            &.fullscreen {
                margin: 0;
                min-height: 100vh;
            }
        }

        &.lg {
            @media(min-width: $modal-size-lg + $gp * 2) {
                max-width: $modal-size-lg;
                width: var(--modal-width, #{$modal-size-lg});
            }
        }

        &.xl {
            @media(min-width: $modal-size-xl + $gp * 2) {
                max-width: $modal-size-xl;
                width: var(--modal-width, #{$modal-size-xl});
            }
        }
    }

    .modal-content-wrapper {
        background-color: var(--modal-background-color, #{$modal-background-color});
        box-shadow: $elevation-z16;
        overflow: var(--modal-overflow, visible);
        width: 100%;

        @media($medium) {
            border-radius: $border-radius;
        }

        @media($small) {
            display: flex;
            flex-direction: column;
        }
    }

    .modal-body {
        display: flex;
        flex-direction: column;
        flex: 1;

        @media($medium) {
            border-bottom-right-radius: $border-radius;
            border-bottom-left-radius: $border-radius;
        }

        &.form {
            background-color: $color-gray-20;
        }

        &:not(.has-header) {
            @media($medium) {
                border-top-right-radius: $border-radius;
                border-top-left-radius: $border-radius;
            }
        }
    }

    .modal-body-inner {
        padding: var(--modal-padding, #{$gp * 1.5});
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .modal-header {
        --hover-icon-color: #{$color-gray};
        background-color: $color-white;
        border-bottom: var(--modal-header-border, 1px solid #{$color-gray-lighter});
        display: flex;
        align-items: center;
        height: $modal-header-height;
        min-height: $modal-header-height;

        @media($medium) {
            border-top-right-radius: $border-radius;
            border-top-left-radius: $border-radius;
        }

        @media($small) {
            position: -webkit-sticky;
            position: sticky;
            top: 0;
            right: 0;
            left: 0;
            z-index: 10;
        }

        &.sticky {
            position: -webkit-sticky;
            position: sticky;
            top: 0;
            z-index: 10;
        }

        .navigation {
            --icon-color: #{$color-gray};
            cursor: pointer;
            height: 100%;
            padding: 0 $gp / 2;
            display: flex;
            align-items: center;
        }

        h4 {
            max-height: px-to-rem(24px);
        }

        h4,
        p {
            margin: 0;
        }

        .text, .title {
            flex: 1;
            padding: px-to-rem(2px) $gp / 2 0;
        }

        .title {
            padding-left: 0;
        }

        .text:not(.editable) {
            @include ellipsis;

            h4 {
                @include ellipsis;
            }
        }

        &.has-navigation {
            .text, .title {
                @include margin-start(0, true);
            }
        }

        p {
            color: $color-gray-80;
            font-size: $font-size-xsmall;
        }

        .action {
            height: 100%;
            padding: 0 $gp / 2;
            display: flex;
            align-items: center;

            a {
                display: none;
            }

            @media($small) {
                a {
                    display: block;
                }

                .button-loading {
                    display: none;
                }
            }
        }
    }

    @media print {
        .modal-content-wrapper {
            box-shadow: none;
        }

        .modal-overlay {
            position: absolute;
            overflow: visible;
        }
    }
</style>
