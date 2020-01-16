let scrollBarWidth;

/* istanbul ignore next */
export default () => {
    /* istanbul ignore next */
    if (scrollBarWidth !== undefined) return scrollBarWidth;

    /* istanbul ignore next */
    const outer = document.createElement('div');

    /* istanbul ignore next */
    outer.style.visibility = 'hidden';
    /* istanbul ignore next */
    outer.style.width = '100px';
    /* istanbul ignore next */
    outer.style.position = 'absolute';
    /* istanbul ignore next */
    outer.style.top = '-9999px';
    /* istanbul ignore next */
    document.body.appendChild(outer);

    /* istanbul ignore next */
    const widthNoScroll = outer.offsetWidth;

    /* istanbul ignore next */
    outer.style.overflow = 'scroll';

    /* istanbul ignore next */
    const inner = document.createElement('div');

    /* istanbul ignore next */
    inner.style.width = '100%';
    /* istanbul ignore next */
    outer.appendChild(inner);

    /* istanbul ignore next */
    const widthWithScroll = inner.offsetWidth;

    /* istanbul ignore next */
    outer.parentNode.removeChild(outer);
    /* istanbul ignore next */
    scrollBarWidth = widthNoScroll - widthWithScroll;

    /* istanbul ignore next */
    return scrollBarWidth;
};
