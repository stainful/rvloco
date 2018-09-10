import React, { Component } from 'react';
import styled from 'styled-components';
import { Button } from '@blueprintjs/core';
import { Column, Table, EditableCell, Cell, TableLoadingOption } from '@blueprintjs/table';
import ConfirmDialog from '../ConfirmDialog';
import Filter from '../Filter';
import Pagination from '../Pagination';

const compare = (str, value) => str && str.toLowerCase().includes(value);

const getNumRows = (data, pageSize) => (data.length > pageSize ? pageSize : data.length);

const getColumnWidth = wrapper => (wrapper ? (wrapper.clientWidth - 50) / 3 : 0);

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

const PaginationWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const ControlsCell = styled(Cell)`
    display: 'flex';
    justify-content: center;
`;

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
        };
    }

    componentDidMount() {
        this.computeData();
        this.props.setUpdateHandler(this.computeData);
    }

    getLoadingOptions() {
        return this.props.loading
            ? [TableLoadingOption.CELLS, TableLoadingOption.COLUMN_HEADERS]
            : [];
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

    cellRenderer = (index, key) => {
        const { editingCell, computedData } = this.state;
        const rowIndex = computedData[index].name;
        const loading = editingCell.row === rowIndex && editingCell.column === key;

        return (
            <EditableCell
                rowIndex={rowIndex}
                loading={loading}
                columnIndex={key}
                value={computedData[index][key]}
                onConfirm={this.cellChangeHandler}
            />
        );
    };

    controlsColumnRender = index => (
        <ControlsCell>
            <Button
                small
                icon="trash"
                intent="danger"
                onClick={() => this.openDialog(this.state.computedData[index].name)}
            />
        </ControlsCell>
    );

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
        } = this.state;

        const numRows = getNumRows(computedData, pageSize);
        const columnWidth = getColumnWidth(this.wrapper);

        return (
            <div
                ref={wrapper => {
                    this.wrapper = wrapper;
                }}
            >
                <ConfirmDialog
                    isOpen={isDialogOpen}
                    loading={deleting}
                    hideDialog={this.hideDialog}
                    deleteHandeler={this.deleteRow}
                />
                <Filter value={filterValue} handler={this.filterChangeHandler} />
                <Table
                    enableRowHeader={false}
                    numRows={numRows}
                    loadingOptions={this.getLoadingOptions()}
                    columnWidths={[columnWidth, columnWidth, columnWidth, 50]}
                >
                    <Column name="Name" cellRenderer={index => this.cellRenderer(index, 'name')} />
                    <Column name="Ru" cellRenderer={index => this.cellRenderer(index, 'ru')} />
                    <Column name="En" cellRenderer={index => this.cellRenderer(index, 'en')} />
                    <Column name="" cellRenderer={this.controlsColumnRender} />
                </Table>
                <PaginationWrapper>
                    <Pagination
                        total={total}
                        current={currentPage}
                        handler={this.pageChangeHandler}
                        pageSize={pageSize}
                    />
                </PaginationWrapper>
            </div>
        );
    }
}

export default List;
