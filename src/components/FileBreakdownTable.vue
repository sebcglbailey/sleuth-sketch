<template lang="html">
    <table-grid
        ref="table"
        :data="data"
        :sort-field="sortField"
        :sort-ascending="sortAscending"
        @sort="sort"
    >
        <table-grid-column
            label="File"
            prop="filename"
            sortable
        />

        <table-grid-column
            label="Layers"
            prop="layers"
            width="50"
            sortable
            numeric
        />

        <table-grid-column
            label="Lib Symbols"
            prop="layersReferencingExternalSymbols"
            width="50"
            sortable
            numeric
        />

        <table-grid-column
            label="Lib Colors"
            prop="layersReferencingExternalLayerStyles"
            width="50"
            sortable
            numeric
        />

        <table-grid-column
            label="Lib Type"
            prop="layersReferencingExternalTextStyles"
            width="50"
            sortable
            numeric
        />

        <table-grid-column
            label="Coverage"
            prop="coverage"
            sortable
            numeric
        >
            <span slot-scope="props">{{ props.coverage }}%</span>
        </table-grid-column>
    </table-grid>
</template>

<script>
import TableGrid from '@/components/TableGrid/TableGrid';
import TableGridColumn from '@/components/TableGrid/TableGridColumn';

export default {
    name: 'FileBreakdownTable',

    components: {
        TableGrid,
        TableGridColumn,
    },

    props: {
        data: Array,
    },

    data() {
        return {
            sortField: 'filename',
            sortAscending: true,
        };
    },

    methods: {
        sort({ field, ascending }) {
            this.sortField = field;
            this.sortAscending = ascending;

            this.data.sort((a, b) => ascending ? this.compare(a, b, field) : this.compare(b, a, field));
        },

        compare(a, b, field) {
            return (a[field] < b[field]) ? -1 : (a[field] > b[field]) ? 1 : 0;
        },
    },
};
</script>
