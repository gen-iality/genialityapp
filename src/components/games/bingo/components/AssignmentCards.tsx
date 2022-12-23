import { CheckCircleOutlined, CloseCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, List, Row, Space, Typography } from 'antd';
import { AssignmentCardsProps, listUsers } from '../interfaces/bingo';
import SearchUser from './SearchUser';
import { useState, useEffect, useRef } from 'react';
import AssignmentCard from './AssignmentCard';
import PrintComponent from './PrintComponent';
import PrintCardBoard from './PrintCardBoard';
import { getListUsersWithOrWithoutBingo } from '@/components/games/bingo/services';

const AssignmentCards = ({
	generateBingoForAllUsers,
	generateBingoForExclusiveUsers,
	//listUsers,
	bingo,
}: //bingoPrint,
AssignmentCardsProps) => {
	const [keyboard, setKeyboard] = useState('');
	const [searchData, setDataSearchData] = useState<listUsers[]>([]);
	const bingoCardRef = useRef();

	//Paginacion
	const [data, setData] = useState<listUsers[]>([]);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [total, setTotal] = useState(0);

	const dataList = async (pageSize: number, page: number) => {
		//console.log("DATA LIST", pageSize, page);
		const response = await getListUsersWithOrWithoutBingo(bingo.event_id, pageSize, page);
		//console.log("RESPONSE", response)
		setData(response.data);
		setTotal(response.total);
		setPage(page);
		setPageSize(pageSize);
	};

	useEffect(() => {
		dataList(pageSize, page);
		onSubmit(keyboard);
		setKeyboard('');
		return () => {
			setDataSearchData([]);
		};
	}, [pageSize, page]);

	const onSubmit = (values: string) => {
		const userSearch = data.filter(
			user =>
				user.properties.names.toLocaleLowerCase().includes(values.toLocaleLowerCase()) ||
				user._id.includes(values) ||
				user.properties.email.toLocaleLowerCase().includes(values.toLocaleLowerCase())
		);
		if (keyboard === '') {
			setDataSearchData(data);
		}
		setDataSearchData(userSearch);
	};
	const handleChange = (event: any) => {
		setKeyboard(event.target.value);
	};

	useEffect(() => {
		onSubmit(keyboard);
		return () => {
			setDataSearchData([]);
		};
	}, [keyboard, data]);

	return (
		<Row gutter={[16, 16]} style={{ padding: '20px' }}>
			<Col span={24}>
				<Card hoverable={true} style={{ cursor: 'auto', marginBottom: '20px', borderRadius: '20px' }}>
					<Row justify='space-between'>
						<Typography.Title level={5}>Lista de participantes</Typography.Title>
						<Space wrap>
							<Button
								type='primary'
								disabled={bingo.bingo_values.length < bingo.dimensions.minimun_values}
								style={{ minWidth: '250px' }}
								onClick={generateBingoForAllUsers}>
								Generar cartones a todos
							</Button>
							<Button
								disabled={bingo.bingo_values.length < bingo.dimensions.minimun_values}
								type='primary'
								style={{ minWidth: '250px' }}
								onClick={generateBingoForExclusiveUsers}>
								Generar cartones faltantes
							</Button>
						</Space>
						{bingo.bingo_values.length >= bingo.dimensions.minimun_values && (
							<PrintCardBoard bingoCardRef={bingoCardRef} cardboardCode='AlUserBingo' />
						)}
					</Row>
					<br />
					<SearchUser onSubmit={onSubmit} handleChange={handleChange} keyboard={keyboard} />
					<br />
					{data.length > 0 && (
						<List
							dataSource={keyboard.length > 0 ? searchData : data}
							className='desplazar'
							style={{ marginTop: '10px', minHeight: '100%', maxHeight: '60vh', overflowY: 'scroll' }}
							pagination={{
								current: page,
								pageSize: pageSize,
								onChange: async (page, pageSize) => {
									//console.log("ONCHANGE", pageSize, page);
									await dataList(pageSize, page);
								},
								showSizeChanger: true,
								onShowSizeChange: async (page, pageSize) => {
									//console.log("ONSHOWSIZECHANGE");
									await dataList(pageSize, page);
								},
								total: total,
							}}
							renderItem={(user: any, index) => {
								return <AssignmentCard user={user} key={index} bingo={bingo} />;
							}}
						/>
					)}
				</Card>
			</Col>
			{bingo.bingo_values.length >= bingo.dimensions.minimun_values && (
				<PrintComponent
					bingoCardRef={bingoCardRef}
					bingoUsers={(keyboard.length > 0 ? searchData : data).map((user: any) => {
						return {
							code: user.bingo_card.code,
              email: user.properties.email,
              id: user.bingo_card.event_user_id,
              names: user.properties.names,
              values: user.bingo_card.values_bingo_card
						};
					})}
					bingo={bingo}
					cardboardCode='BingoCards'
					isPrint
				/>
			)}

			{/* <Col span={12}></Col> */}
		</Row>
	);
};
export default AssignmentCards;
