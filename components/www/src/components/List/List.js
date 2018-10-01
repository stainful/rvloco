import React, { Component, Fragment } from 'react';
import Table from '../Table';
import ConfirmDialog from '../ConfirmDialog';

const compare = (str, value) => str && str.toLowerCase().includes(value);

const getFiltereData = (data, value) =>
    value
        ? data.filter(
              ({ name, ru, en }) => compare(name, value) || compare(ru, value) || compare(en, value)
          )
        : data;

const getDataSlice = (data, currentPage, pageSize) => {
    const { length } = data;
    if (!length) {
        return [];
    }
    const start = currentPage * pageSize;
    const end = start + pageSize > length ? length : start + pageSize;
    return data.slice(start, end);
};

class List extends Component {
    static defaultProps = {
        data: new Array(25).fill({ name: '', ru: '', en: '' }),
    };

    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            deletingRow: null,
            isDialogOpen: false,
            pageSize: 25,
            deleting: false,
            currentPage: 0,
            computedData: [],
            filterValue: '',
            editingCell: {
                row: null,
                column: null,
            },
            columns: [
                { key: 'name', title: 'Name', sorting: true },
                { key: 'ru', title: 'Ru', sorting: true },
                { key: 'en', title: 'En', sorting: true },
            ],
        };
    }

    componentDidMount() {
        this.computeData();
        this.props.setUpdateHandler(this.computeData);
    }

    computeData = () => {
        const { data } = this.props;
        const { currentPage, filterValue, pageSize } = this.state;
        const filteredData = getFiltereData(data, filterValue.toLowerCase());
        const current = currentPage * pageSize > filteredData.length ? 0 : currentPage;
        const computedData = getDataSlice(filteredData, current, pageSize);

        this.setState({ total: filteredData.length, computedData, currentPage: current });
    };

    filterChangeHandler = value => this.setState({ filterValue: value }, this.computeData);

    setEditingCell = (row, column) => this.setState({ editingCell: { row, column } });

    resetEditingCell = () => this.setState({ editingCell: { row: null, column: null } });

    pageChangeHandler = currentPage =>
        this.setState({ currentPage }, this.computeData, {
            onSuccess: () => null,
            onError: () => null,
        });

    cellChangeHandler = (value, row, key) => {
        const oldData = this.state.computedData.find(({ name }) => name === row);
        if (oldData[key] === value) {
            return;
        }

        this.setEditingCell(row, key);
        const newValue = { ...oldData, [key]: value };
        this.props.changeRow(row, newValue, {
            onSuccess: this.resetEditingCell,
            onError: this.resetEditingCell,
        });
    };

    openDialog = deletingRow => this.setState({ deletingRow, isDialogOpen: true });

    hideDialog = () => this.setState({ deletingRow: null, isDialogOpen: false, deleting: false });

    deleteRow = () => {
        const { deletingRow } = this.state;
        this.setState({ deleting: true });
        this.props.deleteRow(deletingRow, {
            onSuccess: this.hideDialog,
            onError: () => this.setState({ deleting: false }),
        });
    };

    render() {
        const {
            computedData,
            filterValue,
            currentPage,
            total,
            pageSize,
            isDialogOpen,
            deleting,
            columns,
        } = this.state;

        return (
            <Fragment>
                <ConfirmDialog
                    isOpen={isDialogOpen}
                    loading={deleting}
                    hideDialog={this.hideDialog}
                    deleteHandeler={this.deleteRow}
                />
                <Table
                    data={computedData}
                    columns={columns}
                    total={total}
                    filterValue={filterValue}
                    filterChangeHandler={this.filterChangeHandler}
                    currentPage={currentPage}
                    pageChangeHandler={this.pageChangeHandler}
                    pageSize={pageSize}
                />
            </Fragment>
        );
    }
}

export default List;
