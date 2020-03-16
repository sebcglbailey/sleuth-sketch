<script>
export default {
    props: {
        data: {
            type: Object,
            docdescription: 'Data to display in a cell',
        },

        column: {
            type: Object,
            docdescription: 'Column data',
        },
    },

    render(h) {
        const { scopedSlots, property, numeric } = this.column;
        let content;

        if (scopedSlots) {
            content = scopedSlots.default(this.data);
        } else {
            content = this.data[property];
        }

        return h(
            'td',
            {
                class: {
                    numeric,
                },
            },
            [
                h(
                    'div',
                    {
                        class: {
                            cell: true,
                        },
                    },
                    content,
                ),
            ],
        );
    },
};
</script>
