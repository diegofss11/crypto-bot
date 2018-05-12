import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import PrefixedTextField from './components/PrefixedTextField';
import TextField from 'material-ui/TextField';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import SelectField from 'material-ui/SelectField';
import CircularProgress from 'material-ui/CircularProgress';
import MenuItem from 'material-ui/MenuItem';
import Notification from 'material-ui/svg-icons/notification/sync';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Snackbar from 'material-ui/Snackbar';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';

import './App.css';
import { defaultInputFormStyle, defaultSelectFieldFormStyle, radioButtonGroupStyle } from './styles/inputFields';
import { paperContainerStyle, successSnackBar } from './styles/containers';
import { refreshStyle, circularProgressStyle } from './styles/icons';
import { porcentageAmountStyle } from './styles/buttons';

import {
  getCoins,
  getExchanges,
  getCoinPrice,
  getBitcoinBalance,
  submitOrder
} from './api-utils/requests';

//API MOCKS
const exchanges = getExchanges();
// ----

class App extends Component {
  state = {
    apiKey: '',
    secretKey: '',
    bitcoinBalance: '',

    coin: '',
    btcAmount: '',
    stopLoss: '',
    sellTarget: '',
    sellOrderType: 'MARKET',
    exchange: '',
    
    coinPrice: '',
    isLoading: false,
    isSubmitted: false,
    coins: []
  }

  componentDidMount() {
    this.setState({
      apiKey: JSON.parse(localStorage.getItem('apiKey')),
      secretKey: JSON.parse(localStorage.getItem('secretKey'))
    });
  }

  handleFieldChange = (field,
    { target }) => {
    const value = target.value;

    this.setState({
      [field]: value
    });
  }

  setPercentageAmount = percentage => {
    const { bitcoinBalance } = this.state;
    const btcAmount = (bitcoinBalance /100) * percentage;

    this.setState({ btcAmount });
  }

  getBalance = () => {
    getBitcoinBalance()
      .then(response => this.setState({ bitcoinBalance: response }))
  }

  handleCoinChange = (e) => {
    const value = e.target.textContent;
    const { exchange } = this.state;

    this.setState({ isLoading: true })

    // TO DO - Less robust - API only accepts lower case
    getCoinPrice(exchange.toLowerCase(), value)
      .then((response) =>
        // TO DO - return an object instead of array
        this.setState({
          coin: response[0].coin,
          coinPrice: response[0].price,
          isLoading: false,
        })
      );
  }

  handleExchangeChange = (e) => {
    const value = e.target.textContent;

    this.setState({
      exchange: value,
      isLoading: true,
    });
    
    // TO DO - Less robust - API only accepts lower case
    getCoins(value.toLowerCase())
      .then(coins =>
        this.setState({
          coins,
          isLoading: false,
        })
      );
  }

  onSubmit = () => {
    const { apiKey, secretKey } = this.state;

    this.setState({ isLoading: true})

    submitOrder();

    localStorage.setItem('apiKey', JSON.stringify(apiKey));
    localStorage.setItem('secretKey', JSON.stringify(secretKey));
    
    this.setState({ isSubmitted: true, isLoading: false });
  }

  handleRequestClose = () => {
    this.setState({ isSubmitted: false });
  };

  render() {
    const {
      apiKey,
      secretKey,
      bitcoinBalance,
      coin,
      btcAmount,
      exchange,
      sellTarget,
      stopLoss,
      coinPrice,
      coins,
      sellOrderType,
      isLoading,
    } = this.state;

    return (
      <MuiThemeProvider>
        <Paper
          className={isLoading ? 'loading' : undefined}
          style={paperContainerStyle}
          zDepth={1}
        >
          <h1 className="title">Crypto Bot</h1>

          {isLoading &&
            <CircularProgress
              style={circularProgressStyle}
              size={60}
            />
          }

          <section className="section">
            <SelectField
              floatingLabelText="Select an Exchange..."
              style={defaultSelectFieldFormStyle}
              value={exchange}
              onChange={(e, index) => this.handleExchangeChange(e)}
            >
              { exchanges.map((value, index) =>
                  <MenuItem
                    key={index}
                    value={value}
                    primaryText={value}
                  />
              )}
            </SelectField>

            <SelectField
              floatingLabelText="Select a coin..."
              style={defaultSelectFieldFormStyle}
              value={coin}
              disabled={!exchange}
              onChange={(e, index) => this.handleCoinChange(e)}
            >
              { coins.map((value, index) =>
                  <MenuItem
                    key={index}
                    value={value}
                    primaryText={value}
                  />
              )}
            </SelectField>
          </section>

          {coinPrice &&
            <span className="text-info">
              {coin} value: <span className="amount-info">{coinPrice}</span> </span>
          }

          <section className="section">
            <TextField
              floatingLabelText="API Key..."
              style={defaultInputFormStyle}
              value={apiKey}
              onChange={(e) => this.handleFieldChange('apiKey', e)}
            />
            <TextField
              floatingLabelText="Secret Key..."
              style={defaultInputFormStyle}
              value={secretKey}
              onChange={(e) => this.handleFieldChange('secretKey', e)}
            />

            <div className="inline">
              <span className="text-info">
                BTC Balance: <span className="amount-info">{bitcoinBalance}</span>
              </span>

              <FlatButton
                icon={<Notification />}
                style={refreshStyle}
                onClick={this.getBalance}
              />
            </div>
          </section>
          
          <section className="section">
            <TextField
              floatingLabelText="Enter the BTC amount..."
              style={defaultInputFormStyle}
              value={btcAmount}
              type="number"
              onChange={(e) => this.handleFieldChange('btcAmount', e)}
            />
            <div className="inline">
              <RaisedButton
                style={porcentageAmountStyle}
                onClick={() => this.setPercentageAmount(25)}
                label="25%"
              />
              <RaisedButton
                style={porcentageAmountStyle}
                onClick={() => this.setPercentageAmount(50)}
                label="50%"
              />
              <RaisedButton
                style={porcentageAmountStyle}
                onClick={() => this.setPercentageAmount(75)}
                label="75%"
              />
              <RaisedButton
                style={porcentageAmountStyle}
                onClick={() => this.setPercentageAmount(100)}
                label="100%"
              />
            </div>
          </section>

          <section className="section">
            <RadioButtonGroup
              name="sellOrderTypeRadioGroup"
              defaultSelected="MARKET"
              valueSelected={sellOrderType}
              style={radioButtonGroupStyle}
              onChange={(e) => this.handleFieldChange('sellOrderType', e)}
            >
              <RadioButton
                value="MARKET"
                label="Market"
              />
              <RadioButton
                value="LIMIT"
                label="Limit"
              />
            </RadioButtonGroup>

            <div className="stop-losses">
              <PrefixedTextField
                floatingLabelText="Stop Loss..."
                prefix="%"
                style={defaultInputFormStyle}
                value={stopLoss}
                type="number"
                onChange={(e) => this.handleFieldChange('stopLoss', e)}
              />

              <PrefixedTextField
                floatingLabelText="Sell target..."
                prefix="%"
                style={defaultInputFormStyle}
                value={sellTarget}
                type="number"
                onChange={(e) => this.handleFieldChange('sellTarget', e)}
              />
            </div>
          </section>

          <div
            className="action-buttons"
          >
            <RaisedButton
              label={`Buy ${coin ? coin : ''}`}
              onClick={ () => this.onSubmit()}
              fullWidth={true}
            />
          </div>

          <Snackbar
            open={this.state.isSubmitted}
            message="Done"
            autoHideDuration={4000}
            bodyStyle={successSnackBar}
            onRequestClose={this.handleRequestClose}
          />
        </Paper>
      </MuiThemeProvider>
    );
  }
}

export default App;