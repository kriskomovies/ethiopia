import React from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

type FormContextType<TFieldValues extends FieldValues = FieldValues> = {
  form: UseFormReturn<TFieldValues> | null;
  values: TFieldValues;
};

export const FormContext = React.createContext<FormContextType>({
  form: null,
  values: {},
});

export const useFormContext = () => React.useContext(FormContext);
