import { Avatar, Card, Image, Row, Typography } from 'antd';
import { CurrentBallotValueInterface } from '../interfaces/bingo';

const { Text } = Typography;

const CurrentBallotValue = ({ ballotValue, cEvent }: CurrentBallotValueInterface) => {
  console.log('🚀 ~ file: CurrentBallotValue.tsx ~ line 7 ~ CurrentBallotValue ~ ballotValue', ballotValue);
  return (
    <Card bordered={false} style={{ overflow: 'hidden' }}>
      <Row justify='center' align='middle' style={{ height: '180px' }}>
        {ballotValue?.type === 'image' ? (
          <Image
            className='animate__animated animate__backInLeft'
            preview={{ mask: 'Ver', maskClassName: 'borderRadius' }}
            width={150}
            height={150}
            style={{ borderRadius: '10px', objectFit: 'cover' }}
            src={ballotValue.value}
            alt={ballotValue.value}
          />
        ) : (
          <>
            {ballotValue?.value?.toString().length <= 2 ? (
              <Avatar
                key={ballotValue.value}
                className='animate__animated animate__backInLeft'
                size={100}
                style={{
                  boxShadow: 'inset 0px 0px 20px rgba(0, 0, 0, 0.25)',
                  backgroundColor: cEvent.value?.styles?.toolbarDefaultBg,
                }}>
                <Text
                  strong
                  style={{
                    userSelect: 'none',
                    textAlign: 'center',
                    width: '250px',
                    fontSize: ballotValue?.value?.toString().length <= 10 ? '40px' : '16px',
                    color: cEvent.value?.styles?.textMenu,
                  }}>
                  {ballotValue.value}
                  {/* Aqui agregamos el valor de la balota que se esta mostrando en ese momento*/}
                </Text>
              </Avatar>
            ) : (
              <Text
                key={ballotValue.value}
                className='animate__animated animate__backInLeft'
                style={{
                  textAlign: 'center',
                  width: '250px',
                  fontSize: ballotValue?.value.toString().length <= 10 ? '40px' : '16px',
                }}>
                {ballotValue.value}
                {/* Aqui agregamos el valor de la balota que se esta mostrando en ese momento*/}
              </Text>
            )}
          </>
        )}
      </Row>
    </Card>
  );
};
export default CurrentBallotValue;
