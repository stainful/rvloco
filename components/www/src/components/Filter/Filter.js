import React from 'react';
import { InputGroup } from '@blueprintjs/core';
import styled from 'styled-components';

const StyledInput = styled(InputGroup)`
    margin-bottom: 10px;
`;

const Filter = ({ value, handler }) => (
    <StyledInput
        leftIcon="filter"
        placeholder="Filter"
        value={value}
        onChange={({ target }) => handler(target.value)}
    />
);

Filter.defaultProps = {
    value: '',
    handler: () => null,
};

export default Filter;
