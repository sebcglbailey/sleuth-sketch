<template>
    <svg
        :class="['icon', { 'rtl-flip': shouldRtlFlip }]"
        v-if="svgContentsFromUrl"
        v-html="svgContentsFromUrl"
        :viewBox="attributes.viewBox.value"
    />

    <div v-else-if="hasBadge" class="icon-badge">
        <span class="badge" v-if="showBadge" />
        <span class="badge-icon" v-if="badgeIcon">
            <icon :name="badgeIcon" />
        </span>

        <svg :class="['icon', { 'rtl-flip': shouldRtlFlip }]">
            <use :xlink:href="'#' + name" />
        </svg>
    </div>

    <svg v-else :class="['icon', { 'rtl-flip': shouldRtlFlip }]">
        <use :xlink:href="'#' + name" />
    </svg>
</template>

<script>
const defaultViewBox = {
    value: '0 0 24 24',
};

export default {
    name: 'Icon',

    props: {
        name: {
            type: String,
            default: '',
            docdescription: 'The name of the icon',
        },

        showBadge: {
            type: Boolean,
            default: false,
            docdescription: 'Displays a badge on the top right corner of the icon box',
        },

        badgeIcon: {
            type: String,
            default: '',
            docdescription: 'Name of the icon to display in the badge on the top right corner of the icon box',
        },

        url: {
            type: String,
            default: '',
            docdescription: '(DEPRECATED) The URL path to get the icon from',
        },
    },

    data() {
        return {
            svgContentsFromUrl: '',
            attributes: {
                viewBox: defaultViewBox,
            },
        };
    },

    created() {
        if (this.url) {
            this.insertSvg();
        }
    },

    watch: {
        url() {
            this.insertSvg();
        },
    },

    computed: {
        hasBadge() {
            return Boolean(this.showBadge || this.badgeIcon);
        },

        shouldRtlFlip() {
            return this.name.toLowerCase().includes('left') || this.name.toLowerCase().includes('right');
        },
    },

    methods: {
        insertSvg() {
            const xhr = new XMLHttpRequest();

            xhr.open('GET', this.url);
            xhr.responseType = 'text';

            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        const parser = new DOMParser();
                        const svgResponse = parser.parseFromString(xhr.response, 'image/svg+xml');
                        const svgElement = svgResponse.getElementsByTagName('svg')[0];

                        if (svgElement) {
                            const { innerHTML, attributes } = svgElement;

                            this.svgContentsFromUrl = innerHTML;
                            this.attributes = attributes;

                            if (!attributes || !attributes.viewBox) {
                                this.attributes = { ...this.attributes, viewBox: defaultViewBox };
                            }
                        }
                    }
                }
            };

            xhr.send();
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
     @import "@/styles/main.scss";

    .icon {
        @include transition(var(--icon-transition, all));

        cursor: var(--icon-cursor, inherit);
        height: var(--icon-size, #{$font-size-icons});
        width: var(--icon-size, #{$font-size-icons});
        min-height: var(--icon-size, #{$font-size-icons});
        min-width: var(--icon-size, #{$font-size-icons});
        fill: var(--icon-color, currentcolor);
        margin: var(--icon-margin, 0);
        stroke: none;

        &.rtl-flip {
            @include rtl-flip;
        }
    }

    .icon-badge {
        height: var(--icon-size, #{$font-size-icons});
        width: var(--icon-size, #{$font-size-icons});
        min-height: var(--icon-size, #{$font-size-icons});
        min-width: var(--icon-size, #{$font-size-icons});
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;

        .badge,
        .badge-icon {
            position: absolute;
            top: var(--icon-badge-offset, 0);
            @include position-end(var(--icon-badge-offset, 0));

            z-index: 1;
            background-color: $color-red;
            height: px-to-rem(10px);
            width: px-to-rem(10px);
            border-radius: $border-radius;
        }

        .badge-icon {
            --icon-color: #{$color-white};
            --icon-size: #{px-to-rem(12px)};

            background-color: $color-primary;
            height: px-to-rem(12px);
            width: px-to-rem(12px);
            padding: 0 px-to-rem(2px);
        }
    }
</style>
