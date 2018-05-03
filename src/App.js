import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import Notification from 'material-ui/svg-icons/notification/sync';
import RoomService from 'material-ui/svg-icons/places/room-service';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import './App.css';

const coins = [
  {value: 1, text: 'BTO'},
  {value: 2, text: 'BTC'},
  {value: 3, text: 'ETH'}
];

const defaultInputFormStyle = {
  width: '100%',
};

const previewStyle = {
  flex: 1,
  minWidth: 40,
};

const buttonStyle = {
  textTransformation: 'uppercase',
};

const refreshStyle = {
  flex: 1,
}

const wrapperStyle = {
  display: 'flex',
  flex: 1,
  witdh: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '50px 200px',
  padding: '40px 20px',
}

const bitcoinAmount = 3;

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <Paper style={wrapperStyle} zDepth={1}>
          <RoomService /><h1>Crypto Bot</h1>

          <p> Bitcoins avaiable {bitcoinAmount} BTC </p>

          <div className="inline">
            <TextField
              hintText="API Key"
              style={defaultInputFormStyle}
            />
            <FlatButton
              icon={<RemoveRedEye />}
              style={previewStyle}
            />
          </div>

          <SelectField
            floatingLabelText="Coins"
            style={defaultInputFormStyle}
            // value={this.state.value}
            // onChange={this.handleChange}
          >
            { coins.map(coin =>
                <MenuItem
                  key={coin.value}
                  value={coin.value}
                  primaryText={coin.text}
                />
            )}
          </SelectField>

          <TextField
            hintText="Amount"
            style={defaultInputFormStyle}
          />
            
          <div className="inline action-buttons">
            <RaisedButton
              label="Buy coin at 222"
              style={{ ...buttonStyle, ...defaultInputFormStyle }}
            />
            <FlatButton
                icon={<Notification />}
                style={refreshStyle}
              />
          </div>
        </Paper>
      </MuiThemeProvider>
    );
  }
}

export default App;