const ErrorMessage = ({ errors, name }) => {
  if (!errors[name]) {
    return null;
  }

  return (
    <div style={{ color: 'red' }}>{errors[name]}</div>
  );
};

export default ErrorMessage;
