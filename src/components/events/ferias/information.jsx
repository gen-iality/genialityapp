import { useState } from 'react';
import { Col, Row, Typography, Badge, Skeleton, Spin, Space, Divider, Image, Card } from 'antd';
import { GlobalOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

function FeriaInformation(props) {
	const [loading, setloading] = useState(true);

	return (
		<>
			<div className='feriaInformation'>
				<Row gutter={[20, 20]} className='row'>
					<Col xxl={4} xl={5} lg={6} md={24} sm={24} xs={24} className='container-img'>
						<Image
							loading={loading}
							onLoad={() => setloading(false)}
							src={props.ImgCompany}
							width={200}
							height={200}
							className='image'
						/>
					</Col>
					<Col xxl={20} xl={19} lg={18} md={24} sm={24} xs={24}>
						<Row className='container-information'>
							<Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
								<Text style={{ color: props.color.text }} className='text' type='secondary'>
									{props.titleCompany}
								</Text>
							</Col>
							<Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
								<Paragraph
									ellipsis={{
										rows: 3, // Determina la cantidad de filas que se muestran antes de cortar el texto.
										expandable: true,
										symbol: (
											<span style={{ color: '#2D7FD6', fontSize: '14px' }}>
												ver más
												{/* {Moment.locale() == 'en' ? 'More' : 'Ver más'}{' '} */}
												{/* Se valido de esta forma porque el componente FormattedMessage no hacia
                               efecto en la prop del componente de Ant design */}
											</span>
										),
									}}
									style={{ marginTop: '18px', fontSize: '16px', color: props.color.text }}></Paragraph>
								<span style={{ color: props.color.text }} className='parrafo'>
									{props.Description}
								</span>
								{props.companyDetail &&
								(props.companyDetail.telefono || props.companyDetail.email || props.companyDetail.webpage) ? (
									<Row style={{ fontSize: '14px', marginTop: 12 }}>
										{props.companyDetail.telefono && (
											<Col>
												<span style={{ color: props.color.text, marginRight: 20 }} className='tel'>
													<PhoneOutlined className='icono' /> {props.companyDetail.telefono}
												</span>
											</Col>
										)}
										{props.companyDetail.email && (
											<Col style={{ marginRight: 20 }}>
												<span style={{ color: props.color.text }} className='email'>
													<MailOutlined className='icono' /> {props.companyDetail.email}
												</span>
											</Col>
										)}
										{props.companyDetail.webpage && (
											<Col>
												<span style={{ color: props.color.text }} className='web'>
													<GlobalOutlined style={{ marginRight: 5 }} className='icono' />
													<a
														rel='noreferrer'
														onClick={() => {
															window.open(`${props.companyDetail.pagweb}`, '_blank');
														}}
														target='_blank'>
														<Text style={{ width: '35vh' }} ellipsis={true}>
															{props.companyDetail.webpage}
														</Text>
													</a>
												</span>
											</Col>
										)}
									</Row>
								) : (
									''
								)}
							</Col>
						</Row>
					</Col>
				</Row>
			</div>
		</>
	);
}

export default FeriaInformation;
