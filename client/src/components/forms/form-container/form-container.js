import React from 'react'
import './form-container.css'

const FormContainer = (props) => {
  return (

    <section id='form-container'>

      {props.children}

    </section>

  )
}

export default FormContainer