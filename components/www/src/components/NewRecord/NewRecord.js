import React, { Component, Fragment } from 'react';
import { Button } from '@blueprintjs/core';
import styled from 'styled-components';
import NewRecordForm from '../NewRecordForm';

const StyledButton = styled(Button)`
    margin-bottom: 10px;
`;

class NewRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFormVisible: false,
            loading: false,
        };
    }

    hideDialog = () => this.setState({ isFormVisible: false, loading: false });

    showDialog = () => this.setState({ isFormVisible: true });

    changeHandler = (key, value) => this.setState({ [key]: value });

    create = ({ name, ru, en }, resetFields) => {
        this.setState({ loading: true });
        this.props.create(
            name,
            { ru, en },
            {
                onSuccess: () => {
                    this.hideDialog();
                    resetFields();
                },
                onError: () => this.setState({ loading: false }),
            }
        );
    };

    render() {
        const { isFormVisible, loading } = this.state;
        return (
            <Fragment>
                <NewRecordForm
                    loading={loading}
                    visible={isFormVisible}
                    onClose={this.hideDialog}
                    submitHandler={this.create}
                />

                <StyledButton icon="plus" text="Create new record" onClick={this.showDialog} />
            </Fragment>
        );
    }
}

export default NewRecord;