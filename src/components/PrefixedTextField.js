import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';

const styles = {
	prefixedTextField: {
    alignItems: 'baseline',
    display: 'flex',
    width: '100%'
	},
	prefix: {
    fontWeight: 'bold',
    cursor: 'pointer',
  }
};

const PrefixedTextField = ({ floatingLabelText, prefix, value, style, type, onChange }) => {
  return (
    <div className="prefixedTextField" style={styles.prefixedTextField}>
      { prefix && <span className="prefix" style={styles.prefix}>{prefix}</span> }

      <TextField
        floatingLabelText={floatingLabelText}
        floatingLabelStyle={{marginLeft: 10}}
        hintStyle={{marginLeft: 10}}
        inputStyle={{marginLeft: 10}}
        style={style}
        value={value}
        type={type}
        onChange={onChange}
      />
    </div>
  );
};

PrefixedTextField.propTypes = {
  floatingLabelText: PropTypes.string,
  prefix: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  type: PropTypes.string,
  style: PropTypes.object,
}

PrefixedTextField.defaultProps = {
  value: '',
  style: '',
  floatingLabelText: '',
}

export default PrefixedTextField;