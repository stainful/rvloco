import React, { Component, Fragment } from 'react';
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
            initialName: '',
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

        return name !== state.initialName
            ? {
                  name,
                  initialName: name,
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
        const { initialName, name, ru, en } = this.state;
        this.props.save(
            initialName,
            { name, ru, en },
            {
                onSuccess: () => this.setState({ loading: false }),
                onError: () => this.setState({ loading: false }),
            }
        );
    };

    openDialog = deletingRow => this.setState({ deletingRow, isDialogOpen: true });

    hideDialog = () => this.setState({ deletingRow: null, isDialogOpen: false, deleting: false });

    deleteRow = () => {
        const { deletingRow } = this.state;
        this.setState({ deleting: true });
        this.props.deleteRow(deletingRow, {
            onSuccess: this.hideDialog,
            onError: () => this.setState({ deleting: false }),
        });
    };

    render() {
        const { loading, isDialogOpen, deleting, initialName } = this.state;
        return (
            <Fragment>
                <ConfirmDialog
                    isOpen={isDialogOpen}
                    loading={deleting}
                    hideDialog={this.hideDialog}
                    deleteHandeler={this.deleteRow}
                />
                {this.getFormItem('name', 'Name', 'Please input name')}
                {this.getFormItem('ru', 'Ru', 'Please input russian text')}
                {this.getFormItem('en', 'En', 'Please english text')}
                <ButtonsWrapper>
                    <Button
                        disabled={loading}
                        intent="danger"
                        icon="trash"
                        text="Delete"
                        onClick={() => this.openDialog(initialName)}
                    />
                    <Button loading={loading} icon="floppy-disk" text="Save" onClick={this.save} />
                </ButtonsWrapper>
            </Fragment>
        );
    }
}

export default Settings;
