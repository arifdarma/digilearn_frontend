function FormInput(props) {
  const {
    type, handlechange, name, placeholder, value, htmlFor,
  } = props;
  return (
    <div className="col-12 my-3">
      <label htmlFor={htmlFor} className="col-6">
        <input className="form-control" type={type} placeholder={placeholder} name={name} value={value} onChange={handlechange} />
      </label>
    </div>
  );
}

export default FormInput;
