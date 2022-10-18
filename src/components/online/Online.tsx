import { FunctionComponent } from 'react';

export interface OnlineProps {
  isOnline: boolean | null | undefined;
};

const Online: FunctionComponent<OnlineProps> = (props) => {
  const { isOnline } = props;

  return (
    <div
      style={{
        display: 'block',
        width: '16px',
        height: '16px',
        borderRadius: '8px',
        backgroundColor: isOnline === null ? 'gray' : isOnline ? 'green' : 'red',
      }}
    ></div>
  );
};

export default Online;
