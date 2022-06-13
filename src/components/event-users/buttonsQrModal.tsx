import { Button, Col, Row } from 'antd';

type SearchAndCleanButtonsPropTypes = {
  cleanInputSearch: () => void;
};

export const SearchAndCleanButtons = ({ cleanInputSearch }: SearchAndCleanButtonsPropTypes) => {
  return (
    <Row justify='center' wrap gutter={8}>
      <Col>
        <Button type='primary' htmlType='submit'>
          Buscar
        </Button>
      </Col>
      <Col>
        <Button type='ghost' onClick={() => cleanInputSearch()}>
          Limpiar
        </Button>
      </Col>
    </Row>
  );
};
