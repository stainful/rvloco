import React, { Component } from 'react';
import { Card, Divider, Position, Toaster, Intent } from '@blueprintjs/core';
import styled from 'styled-components';
import methods from '../../services/api/methods'
import List from '../List';
import NewRecord from '../NewRecord';
import Settings from '../Settings';

const Wrapper = styled.div`
    margin: 20px;
    display: flex;
    min-height: calc(100vh - 40px);
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
        this.getData();
    }

    getData = async () => {
        this.setState({ loading: true });
        try {
            const response = await methods.get('/translations');
            const data = response.map(record => ({ name: record.keyname, ru: record.ru_translation, en: record.en_translation }))
            this.setState({ data }, this.state.updateHandler)
        }
        catch (err) {
            this.showErrorNotice(err.message)
        }
        finally {
            this.setState({ loading: false })
        }

    }

    changeData = async (method, url, message, data, { onSuccess = () => null, onError = () => null }) => {
        try {
            const response = await methods[method](url, { data });

            if (response.status !== 200) {
                const err = new Error(`${response.status} ${response.statusText}`);
                throw err;
            }
            this.showSuccessNotice(message);
            await this.getData();
            onSuccess();
        }
        catch (err) {
            this.showErrorNotice(err.message);
            onError(err.message);
        }
    };

    patch = async (...args) => {
        const message = 'Record was updated';
        const url = '/translations';
        await this.changeData('patch', url, message, ...args);
    };

    create = async (...args) => {
        const message = 'Record was created';
        const url = '/translations';
        await this.changeData('post', url, message, ...args);
    };

    destroy = async (...args) => {
        const message = 'Record was deleted';
        const url = '/translations/delete';
        await this.changeData('post', url, message, ...args);
    };

    setUpdateHandler = updateHandler => this.setState({ updateHandler });

    changeSelectedRow = selectedRow => {
        this.setState({ selectedRow });
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
                        selectedRow={selectedRow}
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
                            save={this.patch}
                            deleteRow={this.destroy}
                            changeSelectedRowHandler={this.changeSelectedRow}
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
