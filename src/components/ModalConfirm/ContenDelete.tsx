import { Result, Space, Typography } from 'antd';

interface Props {
  titleConfirm: string;
  descriptionConfirm: string;
}

export const MessageConfirmDelete = ({ titleConfirm, descriptionConfirm }: Props) => {
  return (
    <Result
      status={'warning'}
      title={
        <Typography.Text strong type='warning' style={{ fontSize: 22 }}>
          {titleConfirm}
        </Typography.Text>
      }
      subTitle={
        <Space style={{ textAlign: 'left' }} direction='vertical'>
          <Typography.Paragraph>{descriptionConfirm}</Typography.Paragraph>
        </Space>
      }
    />
  );
};
