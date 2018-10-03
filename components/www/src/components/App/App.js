import React, { Component, Fragment } from 'react';
import { Card, Divider, Position, Toaster, Intent } from '@blueprintjs/core';
import styled from 'styled-components';
import methods from '../../services/api/methods';
import List from '../List';
import NewRecord from '../NewRecord';
import ExportButton from '../ExportButton';
import Settings from '../Settings';
import History from '../History';

const Wrapper = styled.div`
    margin: 20px;
    display: flex;
    height: calc(100vh - 40px);
`;

const TableCard = styled(Card)`
    flex-grow: 1;
    margin-right: 20px;
`;

const SettingsCard = styled(Card)`
    flex: 0 0 400px;
    display: flex;
    flex-direction: column;
`;

const StyledDivider = styled(Divider)`
    margin-bottom: 15px !important;
    margin-top: 20px !important;
`;

const ButtonsWrapper = styled.div`
    min-height: 30px;
    display: flex;
    justify-content: space-between;
`;

export const AppToaster = Toaster.create({
    className: 'recipe-toaster',
    position: Position.TOP,
});

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            history: null,
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
            const data = response
                .map(record => ({
                    name: record.keyname,
                    ru: record.ru_translation,
                    en: record.en_translation,
                }))
                .sort((a, b) => (a.name > b.name ? 1 : -1));

            this.setState({ data }, this.state.updateHandler);
        } catch (err) {
            this.showErrorNotice(err.message);
        } finally {
            this.setState({ loading: false });
        }
    };

    getHistory = async row => {
        if (!row) {
            return this.setState({ history: null });
        }
        try {
            const response = await methods.get(`/translations/${row.name}/history`);
            this.setState({ history: response });
        } catch (err) {
            this.showErrorNotice(err.message);
            this.setState({ history: null });
        }
    };

    changeData = async (
        method,
        url,
        message,
        data,
        { onSuccess = () => null, onError = () => null }
    ) => {
        try {
            const response = await methods[method](url, { data });

            if (response.status !== 200) {
                const err = new Error(`${response.status} ${response.statusText}`);
                throw err;
            }
            this.showSuccessNotice(message);
            await this.getData();
            onSuccess();
        } catch (err) {
            this.showErrorNotice(err.message);
            onError(err.message);
        }
    };

    patch = async (data, options) => {
        const message = 'Record was updated';
        const url = '/translations';
        await this.changeData('patch', url, message, data, options);
        this.getHistory({ name: data.key });
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
        this.getHistory(selectedRow);
    };

    showSuccessNotice = message => {
        AppToaster.show({ message, intent: Intent.SUCCESS, icon: 'tick' });
    };

    showErrorNotice = message => {
        AppToaster.show({ message, intent: Intent.DANGER, icon: 'warning-sign' });
    };

    render() {
        const { loading, data, selectedRow, history } = this.state;
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
                    <ButtonsWrapper>
                        <ExportButton data={data} disabled={loading} />
                        <NewRecord create={this.create} />
                    </ButtonsWrapper>
                    <Fragment>
                        <StyledDivider />
                        {selectedRow !== null ? (
                            <Settings
                                record={selectedRow}
                                save={this.patch}
                                deleteRow={this.destroy}
                                changeSelectedRowHandler={this.changeSelectedRow}
                            />
                        ) : (
                            <div>...or select an existing record to change it.</div>
                        )}
                    </Fragment>
                    {history !== null ? (
                        <Fragment>
                            <StyledDivider />
                            <History records={history} />
                        </Fragment>
                    ) : null}
                </SettingsCard>
            </Wrapper>
        );
    }
}

export default App;
