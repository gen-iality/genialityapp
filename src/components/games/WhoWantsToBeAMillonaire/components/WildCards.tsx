import React from 'react';
import { Space, Button } from 'antd';
import Stages from './Stages';
import { useMillonaireLanding } from '../hooks/useMillonaireLanding';
export default function WildCards() {
  const { onFinishedGame, usedWildCards, onFiftyOverFifty, statusGame } = useMillonaireLanding();
  const { used50 } = usedWildCards;
  return (
    <Space>
      {!used50 && <Button onClick={() => onFiftyOverFifty()}>50/50</Button>}
      <Button onClick={() => onFinishedGame()}>Retirarse</Button>
      <Stages />
    </Space>
  );
}
