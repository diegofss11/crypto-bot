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
import Dialog from 'material-ui/Dialog';
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
import { getValueFromPorcentage, getBTCAmountByCoinPrice } from './utils/math-utils';

//API MOCKS
const exchanges = getExchanges();
// ----

class App extends Component {
  state = {
    apiKey: '',
    secretKey: '',
    btcBalance: '',

    coin: '',
    btcAmount: '',
    stopLoss: '',
    sellTarget: '',
    sellOrderType: 'MARKET',
    exchange: '',
    
    coinPrice: '',
    isLoading: false,
    isSubmitted: false,
    isModalOpen: false,
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
    const { btcBalance } = this.state;
    const btcAmount = (btcBalance /100) * percentage;

    this.setState({ btcAmount });
  }

  getBalance = () => {
    getBitcoinBalance()
      .then(response => this.setState({ btcBalance: response }))
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

    this.setState({ isLoading: true });

    submitOrder();

    localStorage.setItem('apiKey', JSON.stringify(apiKey));
    localStorage.setItem('secretKey', JSON.stringify(secretKey));
    
    this.setState({
      isModalOpen: false,
      isLoading: false,
    });
  }

  onOpenModal = () => {
    this.setState({ isModalOpen: true });
  }

  onCloseModal = () => {
    this.setState({ isModalOpen: false });
  }

  handleRequestClose = () => {
    this.setState({ isSubmitted: false });
  };

  isFormValid = () => {
    const { btcAmount, exchange, coin } = this.state;

    if(!!(btcAmount && exchange && coin)) {
      return true;
    }

    return false;
  }

  render() {
    const {
      apiKey,
      secretKey,
      btcBalance,
      coin,
      btcAmount,
      exchange,
      sellTarget,
      stopLoss,
      coinPrice,
      coins,
      sellOrderType,
      isLoading,
      isModalOpen,
    } = this.state;

    const actions = [
      <FlatButton
        label="Cancel"
        onClick={this.onCloseModal}
      />,

      <FlatButton
        label="Submit"
        primary={true}
        onClick={this.onSubmit}
      />,
    ];


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
                BTC Balance: <span className="amount-info">{btcBalance}</span>
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
                disabled={!stopLoss}
                value="MARKET"
                label="Market"
              />
              <RadioButton
                disabled={!stopLoss}
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
              onClick={ () => this.onOpenModal()}
              disabled={!this.isFormValid()}
              fullWidth={true}
            />
          </div>

          <Dialog
            title="Confirmation"
            actions={actions}
            modal={true}
            open={isModalOpen}
          >
            { stopLoss ?
              (
                `If the last price drops to or below to ${getValueFromPorcentage(coinPrice, stopLoss)},
                an order to sell ${getBTCAmountByCoinPrice(btcAmount,coinPrice)} ${coin} at a price of ${getValueFromPorcentage(coinPrice, sellTarget)} BTC will be placed.`
              ) : (
                `You will buy ${getBTCAmountByCoinPrice(btcAmount, coinPrice)} ${coin} at a price of ${coinPrice}
                and place a limit order to sell at ${sellTarget}%(${getValueFromPorcentage(coinPrice, sellTarget)})`
              )
            }
          </Dialog>

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