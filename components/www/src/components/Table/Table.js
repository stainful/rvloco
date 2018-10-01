import React, { Fragment } from 'react';
import styled from 'styled-components';
import { HTMLTable } from '@blueprintjs/core';
import Filter from '../Filter';
import Pagination from '../Pagination';

const StyledTable = styled(HTMLTable)`
    width: 100%;
`;

const PaginationWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const getThead = columns => (
    <thead>
        <tr>
            {columns.map(({ title }) => (
                <th key={title}>{title}</th>
            ))}
        </tr>
    </thead>
);

const getTbody = (columns, data, clickHandler) => (
    <tbody>
        {data.map((row, index) => (
            <tr key={index} onClick={() => clickHandler(index)}>
                {columns.map(({ key }) => (
                    <td key={key}>{row[key]}</td>
                ))}
            </tr>
        ))}
    </tbody>
);

const Table = ({
    data,
    total,
    columns,
    pageSize,
    filterValue,
    currentPage,
    rowClickHandler,
    pageChangeHandler,
    filterChangeHandler,
}) => {
    return (
        <Fragment>
            <Filter value={filterValue} handler={filterChangeHandler} />
            <StyledTable bordered condensed interactive striped>
                {getThead(columns)}
                {getTbody(columns, data, rowClickHandler)}
            </StyledTable>
            <PaginationWrapper>
                <Pagination
                    total={total}
                    current={currentPage}
                    handler={pageChangeHandler}
                    pageSize={pageSize}
                />
            </PaginationWrapper>
        </Fragment>
    );
};

Table.defaultProps = {
    data: [],
    columns: [],
    rowClickHandler: () => null,
    pageChangeHandler: () => null,
};

export default Table;
