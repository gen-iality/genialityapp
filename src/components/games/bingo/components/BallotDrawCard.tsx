import { Button, Card, Image, Row, Typography } from 'antd';
import { BallotDrawCardInterface } from '../interfaces/bingo';
import { useState, useEffect } from 'react';
const { Title, Text } = Typography;

const BallotDrawCard = ({
  pickedNumber,
  playing,
  generateRandomBallot,
  disableBallotDrawButton,
}: BallotDrawCardInterface) => {
  return (
    <Card
      hoverable
      style={{ borderRadius: '20px', height: '100%' }}
      cover={
        <Row justify='center' align='middle' style={{ height: '200px', overflow: 'hidden' }}>
          <Text style={{ textAlign: 'center', width: '250px' }}>
            {pickedNumber.type === 'image' && (
              <Image
                preview={false}
                width={150}
                height={150}
                style={{ borderRadius: '10px', objectFit: 'cover' }}
                src={pickedNumber.value}
                alt={pickedNumber.value}
                key={pickedNumber.value}
                className='animate__animated animate__backInUp'
              />
            )}
            {pickedNumber.type !== 'image' && (
              <Title
                key={pickedNumber.value}
                className='animate__animated animate__backInUp'
                level={pickedNumber.value.length > 8 ? 5 : 4}
                type='secondary'>
                {pickedNumber.value}
              </Title>
            )}

            {/* Aqui agregamos el valor de la balota que se esta mostrando en ese momento*/}
          </Text>
        </Row>
      }>
      <Row justify='center' align='middle'>
        {playing && (
          <Button
            type='primary'
            onClick={generateRandomBallot}
            disabled={disableBallotDrawButton}
            loading={disableBallotDrawButton}>
            {pickedNumber.value === '¡Preparados!' ? 'Iniciar' : 'Siguiente balota'}
          </Button>
        )}
      </Row>
    </Card>
  );
};
export default BallotDrawCard;
