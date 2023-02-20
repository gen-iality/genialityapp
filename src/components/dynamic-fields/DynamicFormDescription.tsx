import * as React from 'react';
import { Typography, Collapse } from 'antd';
import { IDynamicFieldProps } from './types';
import { useIntl } from 'react-intl'

const DynamicFormDescription: React.FunctionComponent<Pick<IDynamicFieldProps['fieldData'], 'description'>> = (props) => {
  const { description } = props

  const intl = useIntl()

  if (!description) return null

  return (
    <>
    {description.length < 500 && (
      <Typography.Text>{description}</Typography.Text>
    )}

    {description && description.length > 500 && (
      <Collapse defaultActiveKey={['0']} style={{ marginBottom: '15px' }}>
        <Collapse.Panel
          key='1'
          header={intl.formatMessage({
            id: 'registration.message.policy',
          })}
        >
          <pre style={{ whiteSpace: 'normal' }}>{description}</pre>
        </Collapse.Panel>
      </Collapse>
    )}
    </>
  );
};

export default DynamicFormDescription;
