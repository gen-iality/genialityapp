import { Input } from 'antd';
import { useTypeActivity } from '../../../../context/typeactivity/hooks/useTypeActivity';

/**
  addonBefore: 'https://vimeo.com/event/' || https://youtu.be/ || <LinkOutlined />
*/
interface propsOptions {
  addonBefore: React.ReactNode;
  placeholder?: string;
}

const InputSource = ({ addonBefore, placeholder }: propsOptions) => {
  const { selectOption, typeOptions } = useTypeActivity();
  console.log("typeOptions.key==>",typeOptions.key,)
  return (
    <Input
      addonBefore={addonBefore}
      placeholder={placeholder}
      size='large'
      onChange={(e) => {
        console.log('🚀 debug ~ InputSource ~ ---------------------------------------->', e.target.value);
        selectOption(typeOptions.key, e.target.value);
      }}
    />
  );
};

export default InputSource;
