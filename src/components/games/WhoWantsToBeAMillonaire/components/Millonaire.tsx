import { Button, Space, Typography, Slider, Card, Row, Grid, Col, Image, Avatar, Layout, List, Tag } from 'antd';
import { useMillonaireLanding } from '../hooks/useMillonaireLanding';
/* import type { SliderMarks } from 'antd/lib/slider';
import { IStages } from '../interfaces/Millonaire'; */
import Timer from './Timer';
import AlphaAIcon from '@2fd/ant-design-icons/lib/AlphaA';
import AlphaBIcon from '@2fd/ant-design-icons/lib/AlphaB';
import AlphaCIcon from '@2fd/ant-design-icons/lib/AlphaC';
import AlphaDIcon from '@2fd/ant-design-icons/lib/AlphaD';
import ProgressStarIcon from '@2fd/ant-design-icons/lib/ProgressStar';
import { getCorrectColor } from '@/helpers/utils';
import { v4 as uuidv4 } from 'uuid';
const { useBreakpoint } = Grid;

export default function Millonaire() {
	const { currentStage, question, onSaveAnswer, time, millonaire } = useMillonaireLanding();
	const backgroundMillonaire = millonaire.appearance.background_color || '#120754';
	const primaryMillonaire = millonaire.appearance.primary_color || '#FFB500';
	const iconsLetters = {
		1: <AlphaBIcon style={{ fontSize: '30px', color: primaryMillonaire }} />,
		0: <AlphaAIcon style={{ fontSize: '30px', color: primaryMillonaire }} />,
		2: <AlphaCIcon style={{ fontSize: '30px', color: primaryMillonaire }} />,
		3: <AlphaDIcon style={{ fontSize: '30px', color: primaryMillonaire }} />,
	};
	return (
		<Row>
			<Col span={24}>
				<Row gutter={[0, 16]}>
					<Col span={24}>
						<Row justify='center' align='middle'>
							<Col
								xxl={{ span: 8, order: 1 }}
								xl={{ span: 8, order: 1 }}
								lg={{ span: 8, order: 1 }}
								md={{ span: 8, order: 1 }}
								xs={{ span: 12, order: 2 }}
								sm={{ span: 12, order: 2 }}
								style={{ textAlign: 'center' }}>
								<Timer countdown={time} timer={question?.timeForQuestion} />
							</Col>
							<Col
								xxl={{ span: 8, order: 2 }}
								xl={{ span: 8, order: 2 }}
								lg={{ span: 8, order: 2 }}
								md={{ span: 8, order: 2 }}
								sm={{ span: 24, order: 1 }}
								xs={{ span: 24, order: 1 }}
								style={{ textAlign: 'center' }}>
								<Image
									preview={false}
									src={millonaire?.appearance?.logo}
									fallback={'https://via.placeholder.com/500/?text=Image not found!'}
									placeholder={
										<Image
											preview={false}
											height={'200px'}
											width={'200px'}
											src={'https://via.placeholder.com/800/000000/FFFFFF/?text=Cargando'}
										/>
									}
									style={{
										width: '150px',
										height: '150px',
									}}
									alt='logo.png'
								/>
							</Col>
							<Col
								xxl={{ span: 8, order: 3 }}
								xl={{ span: 8, order: 3 }}
								lg={{ span: 8, order: 3 }}
								md={{ span: 8, order: 3 }}
								sm={{ span: 12, order: 3 }}
								xs={{ span: 12, order: 3 }}
								style={{ textAlign: 'center' }}>
								<Tag
									icon={<ProgressStarIcon style={{ fontSize: '20px' }} />}
									color={primaryMillonaire}
									style={{ fontSize: '20px', padding: '10px 10px' }}>
									{currentStage.score}
								</Tag>
							</Col>
						</Row>
					</Col>

					<Col span={24}>
						<Row justify='center' align='middle'>
							<Card
								style={{
									border: 'none',
									backgroundColor: primaryMillonaire + 'CC',
									backdropFilter: 'blur(8px)',
									width: '90%',
								}}>
								<Typography.Paragraph
									className='animate__animated animate__fadeInLeft'
									key={question?.question}
									style={{
										textAlign: 'center',
										fontSize: '20px',
										color: getCorrectColor(primaryMillonaire),
										fontWeight: 'bold',
									}}>
									{question?.question}
								</Typography.Paragraph>
							</Card>
						</Row>
					</Col>
					<Col span={24}>
						<Row justify='center' align='middle'>
							<Card bordered={false} style={{ backgroundColor: 'transparent' }}>
								<Space direction='vertical'>
									{question &&
										question.answers.length > 0 &&
										question.answers.map((answer, index) => {
											return (
												<Card
													className='animate__animated animate__fadeInLeft'
													key={answer.answer + '-' + answer.id}
													bordered={true}
													style={{ backgroundColor: 'transparent', cursor: 'pointer' }}
													onClick={() => onSaveAnswer(question, answer)}
													bodyStyle={{
														padding: '10px 15px',
														background: `radial-gradient(129.07% 129.07% at 50% 56.98%, ${backgroundMillonaire} 0%, ${backgroundMillonaire} 100%)`,
														color: getCorrectColor(backgroundMillonaire),
														borderRadius: '8px',
														minWidth: '300px',
													}}>
													<Space style={{ width: '100%' }} align={'center'}>
														{iconsLetters[index]}
														<Typography.Text style={{ color: getCorrectColor(backgroundMillonaire) }}>
															{answer.answer}
														</Typography.Text>
													</Space>
												</Card>
											);
										})}
									{question && question.answers.length === 0 && (
										<Typography.Title>No hay respuestas asignadas</Typography.Title>
									)}
								</Space>
							</Card>
						</Row>
					</Col>

					{/* <Slider
        defaultValue={stage}
        value={stage}
        step={1}
        disabled
        max={millonaire?.stages?.length}
        marks={marksRender}
      /> */}
				</Row>
			</Col>
			{/* <Col span={6}>
        <List
          style={{ height: '80%' }}
          itemLayout='horizontal'
          dataSource={stagesOrderByStage}
          renderItem={(stage) => (
            <List.Item
              style={{
                backgroundColor: currentStage.stage === stage.stage ? '#ee333e' : '',
              }}>
              <List.Item.Meta avatar={<Avatar>{stage.stage}</Avatar>} title={<p>{stage.score}</p>} />
              {stage.lifeSaver && (
                <div>
                  <SaveFilled />
                </div>
              )}
            </List.Item>
          )}
        />
      </Col> */}
		</Row>
	);
}
