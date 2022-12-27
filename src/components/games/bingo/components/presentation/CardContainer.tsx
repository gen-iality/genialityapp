import { Card, Row } from 'antd';
import React from 'react';

interface CardContainer {
	title?: React.ReactNode;
	extra?: React.ReactNode;
	children: React.ReactNode;
	backgroundImage?: string;
}

interface CardStyles {
	headStyles: React.CSSProperties;
	bodyStyles: React.CSSProperties;
	styles: React.CSSProperties;
}

const CardContainer = ({ title, extra, children, backgroundImage }: CardContainer) => {
	const cardStyles: CardStyles = {
		headStyles: { border: 'none' },
		bodyStyles: { padding: '0px 24px 24px 24px', overflowY:'auto' },
		styles: {
			height: '100%',
			borderRadius: '15px',
			backgroundColor: '#FFFFFFCC',
			/* background: backgroundImage ? `url("${backgroundImage}")`: '',
			backgroundPosition: 'center',
			backgroundRepeat: 'no-repeat',
			backgroundSize: 'cover', */
			/* border:'15px solid transparent',
      borderImage:'url("https://2.bp.blogspot.com/-iN-gBNjrXns/Vmmd9dwN1AI/AAAAAAAAKRo/U408W-u6l2I/s1600/navidad-1.png") 30 round', */
			
		},
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
