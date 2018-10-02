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

const StyledTd = styled.td`
    word-break: break-all;
    width: 33.33%;
`;

const NoData = styled.div`
    margin-top: 20px;
    text-align: center;
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

const getTbody = (columns, data, clickHandler, disabled) => (
    <tbody>
        {data.map((row, index) => (
            <tr key={index} onClick={() => (!disabled ? clickHandler(index) : null)}>
                {columns.map(({ key }) => (
                    <StyledTd key={key}>{row[key]}</StyledTd>
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
    disabled,
    filterValue,
    currentPage,
    rowClickHandler,
    pageChangeHandler,
    filterChangeHandler,
}) => {
    return (
        <Fragment>
            <Filter value={filterValue} handler={filterChangeHandler} />
            <StyledTable bordered condensed interactive={!disabled} striped>
                {getThead(columns)}
                {getTbody(columns, data, rowClickHandler, disabled)}
            </StyledTable>
            {!data.length ? <NoData>No data</NoData> : null}
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
