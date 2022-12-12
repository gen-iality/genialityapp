import { Card } from 'antd';
import React from 'react';

interface CardContainer {
  title?: React.ReactNode;
  extra?: React.ReactNode;
  children: React.ReactNode;
}

const CardContainer = ({ title, extra, children }: CardContainer) => {
  const cardStyles = {
    headStyles: { border: 'none' },
    bodyStyles: { padding: '0px 24px 24px 24px' },
    styles: { height: '100%', borderRadius: '15px' },
  };
  return (
    <Card
      extra={extra}
      title={title}
      headStyle={cardStyles.headStyles}
      bodyStyle={cardStyles.bodyStyles}
      style={cardStyles.styles}>
      {children}
    </Card>
  );
};

export default CardContainer;
