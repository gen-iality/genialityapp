import * as React from 'react';

import { Row, Col, Alert } from 'antd';

import SelectableCard from '../SelectableCard';
import { ActivityTypeCard, ActivityTypeData, WidgetType } from '../schema/structureInterfaces';

export interface ActivityTypeSelectableCardsProps {
  widget: ActivityTypeCard | ActivityTypeData, // Only here
  onWidgetChange: (widget: ActivityTypeCard) => void,
  selected: string | null, // TODO: define the right type
};

function ActivityTypeSelectableCards(props: ActivityTypeSelectableCardsProps) {
  const {
    widget,
    onWidgetChange,
    selected,
  } = props;

  const buildSelectionHandler = (selectedWidget: ActivityTypeCard) => () => onWidgetChange(selectedWidget);

  if (widget.key !== 'type') {
    // Then widget is ActivityTypeCard, not ActivityTypeData
    if (widget.widgetType !== WidgetType.CARD_SET) {
      return <Alert message='Imposible de mostrar' type='error' />
    }
  }

  const cards: ActivityTypeCard[] = widget.cards;

  return (
    <Row justify='center' gutter={[16, 16]}>
      {cards.length === 0 && <p>Ninguna opción fue pasada</p>}
      {cards.map((card, index) => (
        <Col
          span={cards.length < 3 ? 6 : 7}
          offset={cards.length < 3 ? 2 : 1}
          key={'key-' + (card.title || `${index}`)}
        >
          <SelectableCard
            title={card.title}
            description={card.description}
            image={card.image}
            selected={card.key === selected}
            onSelect={buildSelectionHandler(card)}
          />
        </Col>
      ))}
    </Row>
  );
}

export default ActivityTypeSelectableCards;
