import React, { Component } from 'react';
import List from '../List';

class App extends Component {
    changeRow = (name, value) => {
        console.log(name, value);
    };

    deleteRow = key => {
        console.log('delete', key);
    };
    render() {
        return <List deleteRow={this.deleteRow} changeRow={this.changeRow} />;
    }
}

export default App;
