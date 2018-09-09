import React, { Component, Fragment } from 'react';
import { Column, Table, Cell } from '@blueprintjs/table';
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

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            total: 0,
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

    cellRenderer = (index, key) => <Cell>{this.state.computedData[index][key]}</Cell>;

    render() {
        const { computedData, filterValue, currentPage, total, pageSize } = this.state;
        const dataLength = computedData.length;

        const amount = dataLength > pageSize ? pageSize : dataLength;
        return (
            <Fragment>
                <Filter value={filterValue} handler={this.filterChangeHandler} />
                <Table numRows={amount}>
                    <Column name="Name" cellRenderer={index => this.cellRenderer(index, 'name')} />
                    <Column name="Ru" cellRenderer={index => this.cellRenderer(index, 'ru')} />
                    <Column name="En" cellRenderer={index => this.cellRenderer(index, 'en')} />
                </Table>
                <Pagination
                    total={total}
                    current={currentPage}
                    handler={this.pageChangeHandler}
                    pageSize={pageSize}
                />
            </Fragment>
        );
    }
}

export default List;
