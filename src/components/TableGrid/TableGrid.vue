<template>
    <div class="table-grid">
        <div class="hidden-columns">
            <slot/>
        </div>

        <div :class="['table-wrapper']">
            <table>
                <colgroup>
                    <col
                        :name="`col-th-${column.id}`"
                        v-for="(column, i) in columns"
                        :key="i"
                        :width="column.expand ? '' : column.width"
                    />
                </colgroup>

                <thead>
                    <tr>
                        <table-grid-header
                            v-for="column in columns"
                            :key="column.id"
                            :column="column"
                            :sort-field="localSortField"
                            :sort-ascending="localSortAscending"
                            @click.native="sort(column)"
                        />
                    </tr>
                </thead>

                <tbody>
                    <tr
                        v-for="(row, rowIndex) in data"
                        :key="rowIndex"
                        ref="row"
                        :class="clickRow ? 'click-row' : ''"
                    >

                        <table-grid-cell
                            v-for="column in columns"
                            :key="column.id"
                            :data="row"
                            :column="column"
                            @click.native="performAction(row)"
                        />
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import TableGridHeader from './TableGridHeader';
import TableGridCell from './TableGridCell';

export default {
    name: 'TableGrid',

    components: {
        TableGridHeader,
        TableGridCell,
    },

    props: {
        data: {
            type: Array,
            docdescription: 'Array of data to render in the table',
        },

        limit: {
            type: Number,
            docdescription: 'Number of infinite scroll elements at a time',
        },

        selectAll: {
            type: Boolean,
            docdescription: 'Two way binding of the select all option being active',
        },

        selectable: {
            type: Boolean,
            default: false,
            docdescription: 'Allow rows to be selectable',
        },

        showLoading: {
            type: Boolean,
            default: false,
            docdescription: 'Toggle to show loading state',
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

        infinite: {
            type: Boolean,
            default: false,
            docdescription: 'Infinite scrolling of loading data',
        },

        threshold: {
            type: Number,
            docdescription: 'Px threshold of when to load more rows in table',
        },

        debounceDelay: {
            type: Number,
            docdescription: 'Debounce delay of loading more rows in infinite srolling',
        },

        placeholderHeight: {
            type: Number,
            docdescription: 'Height in px of the placeholder row',
        },

        selectedItemLabel: {
            type: String,
            default: '',
            docdescription: 'Label of the selected items to display in the table',
        },

        selectedOptions: {
            type: Array,
            docdescription: 'Label value event names of options to take with selected rows',
        },

        total: {
            type: Number,
            docdescription: 'Total number of rows for when select all is checked',
        },

        value: {
            type: Array,
            default: () => [],
            docdescription: 'Initial value of selected rows or unselected if selecting all with infinite',
        },

        clickRow: {
            type: Function,
            docdescription: 'Action taken when row is clicked',
        },
    },

    /* documentation:start */
    docevents: [
        {
            name: 'input',
            value: 'vmodel value',
            docdescription: 'Triggers input vmodel value changes',
        },
        {
            name: 'limit.sync',
            value: 'infinite scroll limit value',
            docdescription: 'Triggers when the value of the limit is changed internally by the infinite scrolling',
        },
        {
            name: 'load',
            docdescription: 'Triggers when the table is ready for the parent to load more rows',
        },
        {
            name: 'sort',
            value: '{ field: string, ascending: boolean }',
            docdescription: 'Triggers when the user is sorting by a column, passes the field id and ascending or not',
        },
    ],
    /* documentation:end */

    data() {
        return {
            optimalLimit: this.limit || 1,
            loading: true,
            noMoreData: false,
            columns: [],
            localSortField: this.sortField,
            localSortAscending: this.sortAscending,
            placeholder: [{ height: '0.5rem', boxes: [1] }],
            sortable: Boolean(this.sortField),
            selectedRows: this.value,
        };
    },

    created() {
        this.loading = Boolean(!this.data.length);
    },

    watch: {
        showLoading(value) {
            this.loading = value;
        },

        sortField(value) {
            this.localSortField = value;
            this.emitSort();
        },

        sortAscending(value) {
            this.localSortAscending = value;
            this.emitSort();
        },
    },

    methods: {
        finishLoading() {
            this.noMoreData = true;
        },

        load() {
            /* istanbul ignore next */
            if (this.limit < this.optimalLimit) {
                this.$emit('update:limit', this.optimalLimit);
                this.$nextTick(() => {
                    this.$emit('load');
                });
            } else {
                this.$emit('load');
            }
        },

        register(column) {
            this.columns.push(column);
        },

        sort(column) {
            if (this.sortable && column.sortable) {
                this.localSortAscending = column.property === this.localSortField
                    ? !this.localSortAscending : true;

                this.localSortField = column.property;

                this.emitSort();
            }
        },

        emitSort() {
            this.$emit('sort', {
                field: this.localSortField,
                ascending: this.localSortAscending,
            });
        },

        performAction(row) {
            if (typeof this.clickRow === 'function') {
                this.clickRow(row);
            }
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss">
    /* unscoped because these styles need to apply to slotted items */
    .table-grid .table-wrapper tbody {
        @import "@/styles/main.scss";

        a {
            &,
            &:visited,
            &:hover,
            &:active {
                color: $color-text;
            }
        }

        tr:hover a {
            text-decoration: underline;
        }
    }
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "@/styles/main.scss";

    .table-grid {
        position: relative;
        width:100%;

        .hidden-columns {
            display: none;
        }

        td.numeric {
            font-family: $font-table-number;
            font-size: $font-size-sm;
            color: $color-font-primary;
            @include text-align-end;
        }

        th.numeric {
            @include text-align-end;
        }

        tbody {
            tr {
                &:hover {
                    @include transition(background-color);

                    background-color: var(--table-grid-row-hover-background-color, $color-gray-20);
                }
                &.click-row:hover{
                    cursor: pointer;
                }
            }
        }
    }
</style>
