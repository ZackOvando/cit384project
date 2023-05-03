import React from 'react'
import "./button.css"
import { Button } from '@mui/material'

export const ButtonCustom = (props) => {

    return (
        <Button className="button" variant="contained" size='large' onClick={props.function}>{props.buttonTitle}</Button>
    )

}
