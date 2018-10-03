import React, { Component } from 'react';
import styled from 'styled-components';
import { FormGroup, TextArea, Button } from '@blueprintjs/core';
import ConfirmDialog from '../ConfirmDialog';

const ButtonsWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
`;

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deletingRow: null,
            isDialogOpen: false,
            deleting: false,
            loading: false,
            name: '',
            ru: '',
            en: '',
        };
    }

    static defaultProps = {
        record: {},
    };

    static getDerivedStateFromProps(props, state) {
        const { record } = props;
        const { name, ru, en } = record;

        return name !== state.name
            ? {
                  name,
                  ru: ru,
                  en: en,
                  loading: false,
              }
            : state;
    }

    getFormItem = (key, label, placeholder) => (
        <FormGroup label={label}>
            <TextArea
                fill
                value={this.state[key]}
                placeholder={placeholder}
                disabled={this.state.loading}
                onChange={({ target }) => this.changeHandler(key, target)}
            />
        </FormGroup>
    );

    changeHandler = (key, { value }) => {
        this.setState({ [key]: value });
    };

    save = () => {
        this.setState({ loading: true });
        const { name, ru, en } = this.state;
        this.props.save(
            { key: name, ru, en },
            {
                onSuccess: () => this.setState({ loading: false }),
                onError: () => this.setState({ loading: false }),
            }
        );
    };

    showDialog = () => this.setState({ isDialogOpen: true });

    hideDialog = () => this.setState({ deletingRow: null, isDialogOpen: false, deleting: false });

    deleteRow = () => {
        const { name } = this.state;
        this.setState({ deleting: true });
        this.props.deleteRow(
            { key: name },
            {
                onSuccess: () => {
                    this.props.changeSelectedRowHandler(null);
                    this.hideDialog();
                },
                onError: () => this.setState({ deleting: false }),
            }
        );
    };

    render() {
        const { loading, isDialogOpen, deleting } = this.state;
        return (
            <div>
                <ConfirmDialog
                    isOpen={isDialogOpen}
                    loading={deleting}
                    hideDialog={this.hideDialog}
                    deleteHandeler={this.deleteRow}
                />
                {this.getFormItem('ru', 'Ru', 'Please input russian text')}
                {this.getFormItem('en', 'En', 'Please english text')}
                <ButtonsWrapper>
                    <Button
                        disabled={loading}
                        intent="danger"
                        icon="trash"
                        text="Delete"
                        onClick={this.showDialog}
                    />
                    <Button loading={loading} icon="floppy-disk" text="Save" onClick={this.save} />
                </ButtonsWrapper>
            </div>
        );
    }
}

export default Settings;
