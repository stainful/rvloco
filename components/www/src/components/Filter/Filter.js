import React from 'react';
import { InputGroup } from '@blueprintjs/core';

const Filter = ({ value, handler }) => (
    <InputGroup
        large
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
