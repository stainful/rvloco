import React from 'react';
import { InputGroup, Tooltip, Button } from '@blueprintjs/core';
import styled from 'styled-components';

const StyledInput = styled(InputGroup)`
    margin-bottom: 10px;
`;

const Filter = ({ value, handler }) => {
    const ClearButton = (
        <Tooltip content="Clear">
            <Button
                icon="cross"
                minimal={true}
                onClick={() => handler('')}
            />
        </Tooltip>
    );

    return (
        <StyledInput
            leftIcon="filter"
            rightElement={ClearButton}
            placeholder="Filter"
            value={value}
            onChange={({ target }) => handler(target.value)}
        />
    );
}

Filter.defaultProps = {
    value: '',
    handler: () => null,
};

export default Filter;
