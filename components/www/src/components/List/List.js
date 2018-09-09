import React, { Component } from 'react';
import styled from 'styled-components';
import { Button, Dialog, Classes } from '@blueprintjs/core';
import { Column, Table, EditableCell, Cell } from '@blueprintjs/table';
import Filter from '../Filter';
import Pagination from '../Pagination';
import rawData from './data';

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

const ListWrapper = styled.div`
    padding: 20px;
`;

const PaginationWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
`;

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            total: 0,
            deletingRow: null,
            showDialog: false,
            pageSize: 25,
            currentPage: 0,
            computedData: [],
            filterValue: '',
        };
    }

    componentDidMount() {
        const data = Object.entries(rawData).map(([name, { ru, en }]) => ({ name, en, ru }));
        this.setState({ data }, this.computeData);
    }

    computeData = () => {
        const { data, currentPage, filterValue, pageSize } = this.state;
        const filteredData = getFiltereData(data, filterValue.toLowerCase());
        const current = currentPage * pageSize > filteredData.length ? 0 : currentPage;
        const computedData = getDataSlice(filteredData, current, pageSize);

        this.setState({ total: filteredData.length, computedData, currentPage: current });
    };

    filterChangeHandler = value => this.setState({ filterValue: value }, this.computeData);

    pageChangeHandler = currentPage => this.setState({ currentPage }, this.computeData);

    cellChangeHandler = (value, key, row) => {
        const { computedData } = this.state;
        const newValue = { ...computedData.find(({ name }) => name === row), [key]: value };
        this.props.changeRow(row, newValue);
    };

    cellRenderer = (index, key) => (
        <EditableCell
            wrapText
            rowIndex={key}
            interactive
            onConfirm={this.cellChangeHandler}
            value={this.state.computedData[index][key]}
            columnIndex={this.state.computedData[index].name}
        />
    );

    controlsColumnRender = index => {
        const { deleteRow } = this.props;
        return (
            <Cell style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    loading={false}
                    small
                    icon="trash"
                    intent="danger"
                    onClick={() => this.openDialog(this.state.computedData[index].name)}
                />
            </Cell>
        );
    };

    openDialog = deletingRow => this.setState({ deletingRow, showDialog: true });

    hideDialog = () => this.setState({ deletingRow: null, showDialog: false });

    deleteRow = () => {
        this.props.deleteRow(this.state.deletingRow);
        this.hideDialog();
    };

    render() {
        const { computedData, filterValue, currentPage, total, pageSize, showDialog } = this.state;
        const amount = computedData.length > pageSize ? pageSize : computedData.length;
        const columnWidth = this.wrapper ? (this.wrapper.clientWidth - 90) / 3 : 0;

        return (
            <ListWrapper
                innerRef={wrapper => {
                    this.wrapper = wrapper;
                }}
            >
                <Dialog title="Confirm deletion" isOpen={showDialog} onClose={this.hideDialog}>
                    <div className={Classes.DIALOG_BODY}>
                        Are you sure you want to delete this record?
                    </div>
                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button onClick={this.hideDialog}>Cancel</Button>
                            <Button intent="danger" onClick={this.deleteRow}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </Dialog>
                <Filter value={filterValue} handler={this.filterChangeHandler} />
                <Table
                    enableRowHeader={false}
                    numRows={amount}
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
            </ListWrapper>
        );
    }
}

export default List;
