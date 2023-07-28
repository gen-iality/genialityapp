import { Col, Result, Row, Statistic, Typography } from 'antd';
import { Lang, Status, Transaction } from './types';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import { ResultStatusType } from 'antd/lib/result';

interface Props {
	transaction: Transaction | null;
	lang: Lang;
}

export default function ResultPurchase(props: Props) {
	const { transaction, lang } = props;

	const MESSAGES = {
		title: {
			success : {
			es: 'La transacción ha sido exitosa, te llegará un correo con toda la información',
			en: 'The transaction has been successful, you will receive an email with all the information',
			},
			error : {
			es: 'La transacción ha sido rechazada, por favor verifique la informacion.',
			en: 'The transaction has been rejected, please verify the information',
			}
		},
		name: {
			es: 'Nombre completo',
			en: 'Full name',
		},
		phone: {
			es: 'Numero de telefono',
			en: 'Phone number',
		},
		payment: {
			es: 'Método de pago',
			en: 'Payment method',
		},
		status: {
			es: 'Estado',
			en: 'Status',
		},
	};
	const status = () => {
		switch (transaction?.status) {
			case Status.APPROVED:
				return 'success'
			case Status.DECLINED:
			case Status.ERROR:
				return 'error'
			default:
				return 'error'
		}
	  }
	return (
		<Row justify='space-around' gutter={[8, 8]}>
			<Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
				<Result title={transaction?.status}  status={status()} icon={<SafetyCertificateOutlined/>}/>
			</Col>
			<Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
				<Typography.Paragraph>{MESSAGES.title[status()][lang] || MESSAGES.title[status()]['es']}</Typography.Paragraph>
			</Col>
			<Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
				<Statistic
					title={MESSAGES.name[lang] || MESSAGES.name['es']}
					value={transaction?.customerData.fullName}
					valueStyle={{ fontSize: '16px' }}
				/>
			</Col>
			<Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
				<Statistic
					title={MESSAGES.phone[lang] || MESSAGES.phone['es']}
					value={transaction?.customerData.phoneNumber}
					valueStyle={{ fontSize: '16px' }}
				/>
			</Col>
			<Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
				<Statistic
					title={MESSAGES.payment[lang] || MESSAGES.payment['es']}
					value={transaction?.paymentMethod.type}
					valueStyle={{ fontSize: '16px' }}
				/>
			</Col>
			<Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
				<Statistic
					title={MESSAGES.status[lang] || MESSAGES.status['es']}
					value={transaction?.status}
					valueStyle={{ fontSize: '16px' }}
				/>
			</Col>
		</Row>
	);
}
