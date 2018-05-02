import React, { Component } from 'react';
import Button from './components/Button';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './App.css';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <header className="App-header">
          <h1 className="App-title">Crypto Bot</h1>
        </header>
        
        <Button text="Submit" />
      </MuiThemeProvider>
    );
  }
}

export default App;
