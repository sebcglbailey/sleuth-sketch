<script>
import Icon from '@/components/Icon';

export default {
    components: {
        Icon,
    },

    props: {
        column: {
            type: Object,
            docdescription: 'Column data representation',
        },

        sortField: {
            type: String,
            default: '',
            docdescription: 'Id of the data field you want to sort by',
        },

        sortAscending: {
            type: Boolean,
            default: false,
            docdescription: 'Toggle to sort ascending/descending',
        },
    },

    render(h) {
        let { label } = this.column;

        if (this.$t) {
            label = this.$t(label);
        }

        let content = label;
        const {
            property,
            sortable,
            numeric,
            expand,
            width,
        } = this.column;

        if (sortable) {
            content = [
                label,
                h('div', { class: { 'sort-arrows': true } }, [
                    h(
                        'icon',
                        {
                            attrs: {
                                name: 'arrow-up',
                            },
                            class: {
                                active: this.sortField === property,
                                descending: !this.sortAscending,
                            },
                        },
                        '',
                    ),
                ]),
            ];
        }

        return h(
            'th',
            {
                class: {
                    sortable,
                    numeric,
                },
                style: {
                    'min-width': expand ? `${width}px` : '',
                },
            },
            [
                h(
                    'div',
                    {
                        class: {
                            'active-sortable': this.sortField && this.sortField === property,
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
