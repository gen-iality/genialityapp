import React from "react";
import { DatePicker, Form, Input, TimePicker, Select } from "antd";

const FormItem = Form.Item;
const { Option } = Select;

const CreateAntField = (AntComponent) => ({
  field,
  form,
  hasFeedback,
  label,
  selectOptions,
  submitCount,
  type,
  ...props
}) => {
  //   Buscar dentro del arreglo del formulario que campos han sido tocados
  const touched = form.touched[field.name];

  //   Conteo de veces que se hace el Submit
  const submitted = submitCount > 0;

  //   Busca en el arreglo de errores del formulario, si hay errores
  const hasError = form.errors[field.name];

  //   Evalua si tiene errores y se ha hecho el Submit
  const submittedError = hasError && submitted;

  //   Evalua si se tiene errores y si se tocaron los campos
  const touchedError = hasError && touched;

  //   Funcion manejadora para los inputs
  const onInputChange = ({ target: { value } }) =>
    form.setFieldValue(field.name, value);

  //   Funcion manejadora para cualquier otro tipo de campo
  const onChange = (value) => form.setFieldValue(field.name, value);

  //   Esto no se para que sea
  const onBlur = () => form.setFieldTouched(field.name, true);

  return (
    <div className="field-container">
      {/* Help, hasFeedback y validateStatus son propiedades de validacion de ant design */}
      <FormItem
        label={label}
        hasFeedback={
          (hasFeedback && submitted) || (hasFeedback && touched) ? true : false
        }
        help={submittedError || touchedError ? hasError : false}
        validateStatus={submittedError || touchedError ? "error" : "success"}
      >
        <AntComponent
          {...field}
          {...props}
          onBlur={onBlur}
          onChange={type ? onInputChange : onChange}
        >
          {/* Se mapea las opciones solo si el componente recibido tiene selectOptions */}
          {selectOptions &&
            selectOptions.map((item) =>
              typeof item == "number" ? (
                <Option key={item}>{item}</Option>
              ) : (
                <Option key={item.value}>{item.text}</Option>
              )
            )}
        </AntComponent>
      </FormItem>
    </div>
  );
};

export const AntSelect = CreateAntField(Select);
export const AntInput = CreateAntField(Input);
