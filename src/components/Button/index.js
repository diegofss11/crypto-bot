import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

export const Button = ({text}) => (
    <RaisedButton
      label={text}
    />
);

Button.propTypes = {
  text: PropTypes.string.isRequired
};

export default Button;