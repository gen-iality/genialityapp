import * as React from 'react';
import { Input, Form, Result, Typography } from 'antd';
import rules from '../utils/formValidatorRules';
import urlProcessorSet from '../utils/urlProcessorSet';

const { Paragraph } = Typography;

export interface ActivityExternalUrlFieldProps {
  type: string,
  subtitle?: string,
  iconSrc?: string,
  placeholder?: string,
  addonBefore: React.ReactNode,
  onInput: (input: string) => void,
};

function ActivityExternalUrlField(props: ActivityExternalUrlFieldProps) {
  const {
    type,
    subtitle,
    iconSrc,
    placeholder,
    addonBefore,
    onInput,
  } = props;

  return (
    <Result
      style={{ margin: '0px 100px 0px 100px' }}
      icon={<img width={150} src={iconSrc} />}
      subTitle={<Paragraph>{subtitle}</Paragraph>}
      title={
        <Form>
          <Form.Item name='url' rules={rules[type as keyof typeof rules] as unknown as undefined || [{ required: true }]}>
            <Input
              type={type === 'vimeo' ? 'number' : 'text'}
              addonBefore={addonBefore}
              placeholder={placeholder}
              size='large'
              onChange={(e) => {
                // This is for send the ID only if the URL is from YouTube or Vimeo
                onInput(urlProcessorSet[type](e));
              }}
            />
          </Form.Item>
        </Form>
      }
    />
  );
}

export default ActivityExternalUrlField;
