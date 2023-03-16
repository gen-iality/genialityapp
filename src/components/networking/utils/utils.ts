import { TransferType } from "../interfaces/Meetings.interfaces";


export const filterOption = (inputValue: string, option: TransferType) => {
    return option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
}

export const formLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };