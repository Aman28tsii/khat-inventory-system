import React from 'react';
import { useFormContext } from 'react-hook-form';
import Input from '../common/Input/Input';

const FormField = ({ name, label, type = 'text', placeholder, required, ...props }) => {
  const {
    register,
    formState: { errors }
  } = useFormContext();

  const error = errors[name]?.message;

  return (
    <Input
      label={label}
      type={type}
      placeholder={placeholder}
      error={error}
      required={required}
      {...register(name)}
      {...props}
    />
  );
};

export default FormField;