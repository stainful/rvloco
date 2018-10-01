import React, { Fragment } from 'react';
import styled from 'styled-components';
import { FormGroup, TextArea, Button } from '@blueprintjs/core';

const StyledButton = styled(Button)`
    margin-bottom: 10px;
`;

const Settings = ({ record }) => {
    const { name, ru, en } = record;
    return (
        <Fragment>
            <FormGroup label="Name">
                <TextArea fill placeholder="Please input name" defaultValue={name} />
            </FormGroup>
            <FormGroup label="Ru">
                <TextArea fill placeholder="Please input russian text" defaultValue={ru} />
            </FormGroup>
            <FormGroup label="En">
                <TextArea fill placeholder="Please english text" defaultValue={en} />
            </FormGroup>
            <StyledButton icon="floppy-disk" text="Save" />
        </Fragment>
    );
};

Settings.defaultProps = {
    record: {},
};

export default Settings;
