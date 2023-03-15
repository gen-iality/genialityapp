import { TransferType } from "../interfaces/MeetingForm.interface";


export const filterOption = (inputValue: string, option: TransferType) => {
    return option.title.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
}

export const formLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };