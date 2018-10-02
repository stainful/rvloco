import React, { Component, Fragment } from 'react';
import Table from '../Table';

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
        data: new Array(25).fill({ name: ' ', ru: ' ', en: ' ' }),
    };

    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            pageSize: 25,
            deleting: false,
            currentPage: 0,
            computedData: [],
            filterValue: '',
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

    pageChangeHandler = currentPage => {
        this.setState({ currentPage }, this.computeData);
        this.props.changeSelectedRowHandler(null);
    };

    rowClickHandler = index => {
        const { changeSelectedRowHandler } = this.props;
        changeSelectedRowHandler(this.state.computedData[index]);
    };

    render() {
        const { loading, selectedRow } = this.props;
        const { computedData, filterValue, currentPage, total, pageSize, columns } = this.state;
        const selectedIndex = selectedRow
            ? computedData.findIndex(record => record.name === selectedRow.name)
            : null;

        return (
            <Fragment>
                <Table
                    total={total}
                    columns={columns}
                    disabled={loading}
                    data={computedData}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    filterValue={filterValue}
                    selectedIndex={selectedIndex}
                    rowClickHandler={this.rowClickHandler}
                    pageChangeHandler={this.pageChangeHandler}
                    filterChangeHandler={this.filterChangeHandler}
                />
            </Fragment>
        );
    }
}

export default List;
