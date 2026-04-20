import { FormHelperText } from "@mui/material";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  asterisk: {
    color: 'red',
    marginLeft: '2px',
  },
});

function RequiredFieldTag() {
  const classes = useStyles();

  return <FormHelperText>
    <span className={classes.asterisk}>*</span> Required field
  </FormHelperText>;
}

export default RequiredFieldTag;
