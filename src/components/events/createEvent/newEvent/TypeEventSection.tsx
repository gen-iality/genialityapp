import React, { useState } from 'react';
import { Card, Col, Form, Input, InputNumber, Row, Switch } from 'antd';
import { useContextNewEvent } from '@context/newEventContext';
import SelectableCard from '@components/agenda/activityType/components/SelectableCard';

type Props = {};

const TypeEventSection = (props: Props) => {
  const {
    showModal,
    isModalVisible,
    handleCancel,
    handleOk,
    changeSelectHours,
    changeSelectDay,
    selectedDay,
    selectedHours,
    dateEvent,
    handleInput,
    valueInputs,
    containsError,
    selectTemplate,
    templateId,
    dispatch,
    state,
  } = useContextNewEvent();

  const [isCertification, setIsCertification] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (e) => {
    const valueData = e?.target?.value;

    const targetData = e?.target;

    setIsCertification((previous) => !previous);
    setIsChecked((previous) => !previous);
  };

  const cards = [
    { title: 'Curso', description: 'Curso básico' },
    { title: 'Certificación', description: 'Curso básico con la funcionalidad de que es un curso certificado' },
  ];

  return (
    <>
      <Row justify="center" gutter={[16, 16]}>
        {cards.length === 0 && <p>Ninguna opción fue pasada</p>}
        {cards.map((card) => (
          <Col span={8} key={'key-' + card.title}>
            <Card
              title={card.title}
              hoverable

              // description={card.description}
              // image={card.image}
              //  selected={card.key === selected}
              //  onSelect={buildSelectionHandler(card)}
            >
              {card.description}
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default TypeEventSection;
