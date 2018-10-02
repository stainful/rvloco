import React, { Component } from 'react';
import { Button, Dialog, Classes, InputGroup } from '@blueprintjs/core';
import styled from 'styled-components';

const StyledInput = styled(InputGroup)`
    margin-bottom: 10px;

    &:last-of-type {
        margin-bottom: 0;
    }
`;

const initialFieldsValue = { name: '', ru: '', en: '' };

class NewRecordForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialFieldsValue,
            showDialog: false,
        };
    }

    changeHandler = (key, value) => this.setState({ [key]: value });

    getInput = (key, placeholder) => (
        <StyledInput
            large
            value={this.state[key]}
            placeholder={placeholder}
            onChange={({ target }) => this.changeHandler(key, target.value)}
        />
    );

    resetFields = () => this.setState(initialFieldsValue);

    submitHandler = () => {
        this.props.submitHandler(this.state, this.resetFields);
    };

    onClose = () => {
        this.props.onClose();
        this.resetFields();
    };

    render() {
        const { visible, loading } = this.props;
        const disabled = !this.state.name;
        return (
            <Dialog title="New record" isOpen={visible} onClose={this.onClose}>
                <div className={Classes.DIALOG_BODY}>
                    {this.getInput('name', 'Enter name')}
                    {this.getInput('ru', 'Enter russian text')}
                    {this.getInput('en', 'Enter english text')}
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button onClick={this.onClose}>Cancel</Button>
                        <Button
                            loading={loading}
                            disabled={disabled}
                            intent="primary"
                            onClick={this.submitHandler}
                        >
                            Create
                        </Button>
                    </div>
                </div>
            </Dialog>
        );
    }
}

export default NewRecordForm;
