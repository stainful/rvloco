import React, { Component } from 'react';
import { Card, Divider, Position, Toaster, Intent } from '@blueprintjs/core';
import styled from 'styled-components';
import List from '../List';
import NewRecord from '../NewRecord';
import Settings from '../Settings';

import rawData from '../../data';

const Wrapper = styled.div`
    margin: 20px;
    display: flex;
`;

const TableCard = styled(Card)`
    flex-grow: 1;
    margin-right: 20px;
`;

const SettingsCard = styled(Card)`
    flex: 0 0 400px;
`;

const Text = styled.div`
    padding: 10px 0;
`;

export const AppToaster = Toaster.create({
    className: 'recipe-toaster',
    position: Position.TOP,
});

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            selectedRow: null,
            updateHandler: () => null,
        };
    }
    componentDidMount() {
        this.setState({ loading: true });
        setTimeout(() => {
            const data = Object.entries(rawData).map(([name, { ru, en }]) => ({ name, en, ru }));
            this.setState({ data, loading: false }, this.state.updateHandler);
        }, 1500);
    }

    setUpdateHandler = updateHandler => this.setState({ updateHandler });

    changeRow = (name, value, { onSuccess = () => null, onError = () => null }) => {
        setTimeout(() => {
            console.log(name, value);
            onSuccess();
        }, 1000);
    };

    deleteRow = (key, { onSuccess = () => null, onError = () => null }) => {
        setTimeout(() => {
            console.log('delete', key);
            this.changeSelectedRow(null);
            onSuccess();
        }, 1000);
    };

    changeSelectedRow = selectedRow => {
        this.setState({ selectedRow });
    };

    create = (key, body, { onSuccess = () => null, onError = () => null }) => {
        setTimeout(() => {
            console.log(key, body);
            onSuccess();
            this.showSuccessNotice('Record created');
        }, 1000);
    };

    showSuccessNotice = message => {
        AppToaster.show({ message, intent: Intent.SUCCESS, icon: 'tick' });
    };

    showErrorNotice = message => {
        AppToaster.show({ message, intent: Intent.DANGER, icon: 'warning-sign' });
    };

    render() {
        const { loading, data, selectedRow } = this.state;
        return (
            <Wrapper>
                <TableCard>
                    <List
                        data={data}
                        loading={loading}
                        changeRow={this.changeRow}
                        setUpdateHandler={this.setUpdateHandler}
                        changeSelectedRowHandler={this.changeSelectedRow}
                    />
                </TableCard>
                <SettingsCard>
                    <NewRecord create={this.create} />
                    <Divider />
                    {selectedRow !== null ? (
                        <Settings
                            record={selectedRow}
                            save={this.changeRow}
                            deleteRow={this.deleteRow}
                        />
                    ) : (
                        <Text>...or select an existing record to change it.</Text>
                    )}
                </SettingsCard>
            </Wrapper>
        );
    }
}

export default App;
