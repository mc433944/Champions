import React from 'react';

const InputBox = (props) => {
  const {labelTitle, text, handleChange} = props

  return (
    <>
      <label>{labelTitle ? labelTitle : null}</label>
      <textarea onChange={(event) => handleChange(event)} value={text}></textarea>
    </>
  ) 
}

export default InputBox;