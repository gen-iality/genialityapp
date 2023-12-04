import { ColumnsType } from "antd/es/table/interface";
import { IConditionalFieldTable } from "../types/conditional-form.types";

export const columnsConditionalFields:ColumnsType<IConditionalFieldTable> = [
    {
        title: 'Campo validador',
        dataIndex: 'fieldToValidateLabel',
    },
    {
        title: 'Valor',
        dataIndex: 'value',
    },
    {
        title: 'Campos condicionados',
        dataIndex: 'fieldLabels',
    },
    {
        title: 'Estado',
        dataIndex: 'state',
    },
   
];