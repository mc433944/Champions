import React from 'react';

const InputBox = (props) => {
  const {labelTitle, text, handleChange} = props

  return (
    <div style={styles.labelTitleStyle}>
      <label>{labelTitle ? labelTitle : null}</label>
      <textarea onChange={(event) => handleChange(event)} value={text}></textarea>
    </div>
  ) 
}

const styles = {
  labelTitleStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
}

export default InputBox;