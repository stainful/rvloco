import React from 'react';
import styled from 'styled-components';
import { HTMLTable } from '@blueprintjs/core';
import Filter from '../Filter';
import Pagination from '../Pagination';

const Wrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const ListWrapper = styled.div`
    height: calc(100% - 30px);
`;

const TableWrapper = styled.div`
    height: calc(100% - 50px);
    overflow-y: scroll;
`;

const StyledTable = styled(HTMLTable)`
    width: 100%;
`;

const PaginationWrapper = styled.div`
    height: 30px;
    display: flex;
    justify-content: flex-end;
`;

const StyledTr = styled.tr`
    background: ${({ selected }) => (selected ? '#137cbd' : 'transparent')};
    & td {
        color: ${({ selected }) => (selected ? '#fff' : 'inherit')} !important;
    }
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

const getTbody = (columns, data, clickHandler, disabled, selectedIndex) => (
    <tbody>
        {data.map((row, index) => (
            <StyledTr
                selected={index === selectedIndex}
                key={index}
                onClick={() => (!disabled ? clickHandler(index) : null)}
            >
                {columns.map(({ key }) => (
                    <StyledTd key={key}>{row[key]}</StyledTd>
                ))}
            </StyledTr>
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
    selectedIndex,
    rowClickHandler,
    pageChangeHandler,
    filterChangeHandler,
}) => {
    return (
        <Wrapper>
            <ListWrapper>
                <Filter value={filterValue} handler={filterChangeHandler} />
                {data.length ? (
                    <TableWrapper>
                        <StyledTable bordered condensed interactive={!disabled} striped>
                            {getThead(columns)}
                            {getTbody(columns, data, rowClickHandler, disabled, selectedIndex)}
                        </StyledTable>
                    </TableWrapper>
                ) : (
                    <NoData>No data</NoData>
                )}
            </ListWrapper>
            <PaginationWrapper>
                <Pagination
                    total={total}
                    current={currentPage}
                    handler={pageChangeHandler}
                    pageSize={pageSize}
                />
            </PaginationWrapper>
        </Wrapper>
    );
};

Table.defaultProps = {
    data: [],
    columns: [],
    rowClickHandler: () => null,
    pageChangeHandler: () => null,
};

export default Table;
