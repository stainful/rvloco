import React, { Component } from 'react';
import styled from 'styled-components';
import { HTMLTable } from '@blueprintjs/core';

const StyledTable = styled(HTMLTable)`
    width: 100%;
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

const Table = ({ data, columns, rowClickHandler }) => {
    return (
        <StyledTable bordered condensed interactive striped>
            {getThead(columns)}
            {getTbody(columns, data, rowClickHandler)}
        </StyledTable>
    );
};

Table.defaultProps = {
    data: [],
    columns: [],
    rowClickHandler: () => null,
};

export default Table;
