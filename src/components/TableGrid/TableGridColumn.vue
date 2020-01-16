<template>
    <div class="column">
        <slot/>
    </div>
</template>

<script>
let columnIdSeed = 1;

export default {
    name: 'TableGridColumn',

    props: {
        expand: {
            type: Boolean,
            default: false,
            docdescription: 'Prioritize the width of this column, collapsing others',
        },

        label: {
            type: String,
            default: '',
            docdescription: 'Label of the column to display in header',
        },

        numeric: {
            type: Boolean,
            default: false,
            docdescription: 'Apply number styling and alignment to the column',
        },

        prop: {
            type: String,
            default: '',
            docdescription: 'Property name to use in the data object',
        },

        selectable: {
            type: Boolean,
            default: false,
            docdescription: 'Toggle to be able to select this column or not',
        },

        sortable: {
            type: Boolean,
            default: false,
            docdescription: 'Toggle to be able to sort by this column or not',
        },

        width: {
            type: String,
            default: '',
            docdescription: 'Width in px of the column',
        },

    },

    data() {
        return {
            column: {},
        };
    },

    created() {
        this.column = {
            id: `column-${columnIdSeed++}`,
            label: this.label,
            property: this.prop,
            selectable: this.selectable,
            sortable: this.sortable,
            width: this.width || (this.expand ? 256 : 80),
            expand: this.expand,
            numeric: this.numeric,
        };
    },

    mounted() {
        if (this.$scopedSlots.default) {
            this.column.scopedSlots = this.$scopedSlots;
        }

        this.$parent.register(this.column);
    },
};
</script>
