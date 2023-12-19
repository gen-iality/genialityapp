import { useState } from 'react';

export const useForm = <T extends {}>(initialForm: T = {} as T) => {
  const [formState, setFormState] = useState<T>(initialForm);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handledChange = ({ name, value }: { name: string; value: any }) => {
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const onResetForm = () => {
    setFormState(initialForm);
  };

  const setFieldsValue = (formValues: Partial<T>) => {
    setFormState((currentValueState) => ({ ...currentValueState, ...formValues }));
  };

  return {
    ...formState,
    formState,
    onInputChange,
    onResetForm,
    setFormState,
    handledChange,
    setFieldsValue,
  };
};
