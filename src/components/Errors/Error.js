import React from 'react';
import classes from './Error.module.css'

const Error = (props) => {
  let errorMessage = null;

  if (props.errorType === "accu") {
    errorMessage = "You have reached the maximum (50) number of searches for today. Please try again later."
  }

  if (props.errorType === "axios") {
    errorMessage = "There was a problem with your search. Please try again later."
  }

  if (props.errorType === "input") {
    errorMessage = "There are no cities with that name. Try again."
  }

  return (<div className={classes.Error}>Error: {errorMessage}</div>);
}

export default Error;
