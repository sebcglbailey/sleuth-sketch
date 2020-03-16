/*
* Mixin to apply logic of navigating and selecting drop down menu options with keyboard
* 1. Import the mixin and add to the component
* 2. Use the mixin methods at your leisure
*/

import windowMixin from './windowMixin';

export default {
    mixins: [windowMixin],

    methods: {
        dom_isRtl: () => document.documentElement.dir === 'rtl',

        dom_isTouchDevice: () => 'ontouchstart' in window || navigator.msMaxTouchPoints,

        dom_isSmall: () => window.innerWidth < 768,

        dom_clickedTarget(event, target) {
            let isTarget = false;

            if (event && event.target && target) {
                const clickedTarget = event.target === target;
                const clickedTargetChild = target.contains(event.target);

                isTarget = clickedTarget || clickedTargetChild;
            }

            return isTarget;
        },

        dom_isDocument(target) {
            return target === document || target === document.body;
        },

        dom_getScrollParent(element, horizontal) {
            if (element === null || element === document.body) {
                return document.body;
            } else if (!element) {
                return null;
            } else if (element === document) {
                return document;
            }

            const {
                overflow,
                overflowY,
                overflowX,
            } = this.window_getComputedStyle(element, null);

            if (horizontal && /(auto|scroll)/.test([overflow, overflowX].join(''))) {
                return element;
            } else if (/(auto|scroll)/.test([overflow, overflowY].join(''))) {
                return element;
            }

            return this.dom_getScrollParent(element.parentNode);
        },

        dom_distanceToLeftEdge(element, relativeElement) {
            if (element && relativeElement) {
                const elementLeft = element.getBoundingClientRect().left;

                if (relativeElement === document.body || relativeElement === document) {
                    return elementLeft;
                }

                const relativeElementLeft = relativeElement.getBoundingClientRect().left;

                return elementLeft - relativeElementLeft;
            }

            return 0;
        },

        dom_distanceToRightEdge(element, relativeElement) {
            if (element && relativeElement) {
                const elementRight = this.window_window.innerWidth - element.getBoundingClientRect().right;

                if (relativeElement === document.body || relativeElement === document) {
                    return elementRight;
                }

                const relativeElementRight = this.window_window.innerWidth - relativeElement.getBoundingClientRect().right;

                return elementRight - relativeElementRight;
            }

            return 0;
        },

        dom_distanceToTopEdge(element, relativeElement) {
            if (element && relativeElement) {
                const elementTop = element.getBoundingClientRect().top;

                if (relativeElement === document.body || relativeElement === document) {
                    return elementTop;
                }

                const relativeElementTop = relativeElement.getBoundingClientRect().top;

                return elementTop - relativeElementTop;
            }

            return 0;
        },

        dom_distanceToBottomEdge(element, relativeElement, fromTop = false) {
            const elementExists = element && typeof element.getBoundingClientRect === 'function';

            if (elementExists && relativeElement) {
                const elementPoint = fromTop ? element.getBoundingClientRect().top : element.getBoundingClientRect().bottom;

                if (relativeElement === document.body || relativeElement === document) {
                    return this.window_window.innerHeight - elementPoint;
                }

                const relativeElementBottom = relativeElement.getBoundingClientRect().bottom;

                return relativeElementBottom - elementPoint;
            }

            return 0;
        },

        dom_getElementWidthAndHeight(element) {
            if (element) {
                const elementStyle = this.window_getComputedStyle(element, null);

                const elementWidth = parseInt(elementStyle.width, 10) || element.offsetWidth;
                const elementHeight = parseInt(elementStyle.height, 10) || element.offsetHeight;

                const width = elementWidth +
                    parseInt(elementStyle.marginRight, 10) +
                    parseInt(elementStyle.marginLeft, 10);
                const height = elementHeight +
                    parseInt(elementStyle.marginTop, 10) +
                    parseInt(elementStyle.marginBottom, 10);

                return { height, width };
            }

            return { width: 'auto', height: 'auto' };
        },
    },
};
