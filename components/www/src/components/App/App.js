import React, { Component } from 'react';
import styled from 'styled-components';
import List from '../List';
import NewRecord from '../NewRecord';

import rawData from '../../data';

const Wrapper = styled.div`
    margin: 20px;
`;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
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

    changeRow = (name, value, { onSuccess, onError }) => {
        setTimeout(() => {
            console.log(name, value);
            onSuccess();
        }, 1000);
    };

    deleteRow = (key, { onSuccess, onError }) => {
        setTimeout(() => {
            console.log('delete', key);
            onSuccess();
        }, 1000);
    };

    create = (key, body, { onSuccess, onError }) => {
        setTimeout(() => {
            console.log(key, body);
            onSuccess();
        }, 1000);
    };

    render() {
        const { loading, data } = this.state;
        return (
            <Wrapper>
                <NewRecord create={this.create} />
                <List
                    data={data}
                    loading={loading}
                    deleteRow={this.deleteRow}
                    changeRow={this.changeRow}
                    setUpdateHandler={this.setUpdateHandler}
                />
            </Wrapper>
        );
    }
}

export default App;
