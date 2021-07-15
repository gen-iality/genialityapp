import React from 'react';
import { Col, Row, Typography, Badge, Skeleton, Spin, Space, Divider, Image } from 'antd';

function feriaInformation(props) {
  const { Title, Text, Paragraph } = Typography;

  return (
    <>
      <div className='feriaInformation'>
        <Row gutter={[20, 20]} className='row'>
          <Col xxl={4} xl={5} lg={6} md={24} sm={24} xs={24} className='container-img'>
            <Image src={props.ImgCompany} width={200} height={200} className='image' />
          </Col>
          <Col xxl={20} xl={19} lg={18} md={24} sm={24} xs={24}>
            <Row className='container-information'>
              <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                <Text className='text' type='secondary'>
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
                        ver mas
                        {/* {Moment.locale() == 'en' ? 'More' : 'Ver más'}{' '} */}
                        {/* Se valido de esta forma porque el componente FormattedMessage no hacia
                               efecto en la prop del componente de Ant design */}
                      </span>
                    ),
                  }}
                  style={{ marginTop: '18px', fontSize: '16px', color: '#9e9e9e' }}></Paragraph>
                <span className='parrafo'>{props.Description}</span>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default feriaInformation;
