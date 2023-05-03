import React, { useState } from 'react'
import './form.css'
import { MenuItem, TextField } from '@mui/material'

export const Form = (props) => {
  const [error, setError] = useState(false);

  const handleInputChange = (event) => {
    setError(false);
    props.function(event.target.value);
  };

  return (
    <div id="form-body">
      <TextField
        className="form"
        label={props.label}
        variant="outlined"
        value={props.value}
        error={error}
        helperText={error ? props.helperText : ''}
        onChange={handleInputChange}
      />
    </div>
  );
};

export const NumberForm = (props) => {

  const [error, setError] = useState(false)
  const [helperText, setHelperText] = useState('')

  const handleChange = (e) => {

    const regex = /^\d{1,5}$/;

    if (!regex.test(e.target.value)) {
      setHelperText('Only numeric values are allowed')
      setError(true);
    }
    else {
      setError(false);
      props.function(e.target.value)
    }

  };

  return (

    <div id='form-body'>

      <TextField
        className="form"
        label={props.label}
        variant="outlined"
        type="text"
        error={error}
        helperText={error ? helperText : ''}
        inputProps={{
          maxLength: 5
        }}
        onChange={handleChange}
      />

    </div>

  )

}


export const SelectForm = (props) => {

  const [error, setError] = useState(false)

  const SelectFormHandler = (e) => {
    console.log('IT WAS CHANGED: ', e.target.value)
  }

  return (

    <div id='form-body'>

      <TextField
        select
        defaultValue="EUR"
        className="form"
        label={props.label}
        error={error}
        onChange={(e) => SelectFormHandler(e)}
        helperText={error ? props.helperText : ''}>

        {props.data.map((option) => (

          <MenuItem key={option.value} value={option.value} >
            {option.label}
          </MenuItem>

        ))}

      </TextField>

    </div>

  )

}

export const ToggleForm = (props) => {

  const [error, setError] = useState(false)
  const [helperText, setHelperText] = useState('')

  const SelectFormHandler = (e) => {
    props.function(e.target.value)
  }


  return (


    <div id='form-body'>

      <TextField

        defaultValue="1"
        className="form"
        label={props.label}
        type="number"
        onChange={(e) => SelectFormHandler(e)}
        inputProps={{
          min: 1,
        }}
        InputLabelProps={{
          shrink: true,
        }} />

    </div >

  )

}