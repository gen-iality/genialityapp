import { CurrentEventContext } from '@/context/eventContext';
import { CalendarFilled, ClockCircleFilled } from '@ant-design/icons';
import { Card, Col, Row, Space, Typography } from 'antd';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import Countdown, { CountdownRenderProps, zeroPad } from 'react-countdown';

const CountdownBlock = () => {

  const cEvent = useContext(CurrentEventContext);
  const [dateLimitContador, setDateLimitContador] = useState<string | null>(null);
  const textColor = cEvent.value?.styles?.textMenu;
  const date = cEvent.value?.datetime_from;


  useEffect(() => {
    if (!cEvent.value) return;
    //PERMITE FORMATEAR LA FECHA PARA PODER INICIALIZAR EL CONTADOR
    const dateSplit = cEvent.value?.dateLimit? cEvent.value?.dateLimit.split(' ') : cEvent.value?.datetime_from.split(' ');
    const dateFormat = dateSplit.join('T');
    setDateLimitContador(dateFormat);
  }, [cEvent.value]);

  const stylesSubtitle : React.CSSProperties = {
    fontSize: '12px',
    textTransform: 'uppercase',
    color: textColor,
    fontWeight: '500',
  };

  const stylesContainerNumeric : React.CSSProperties  = {
    width: '120px',
    textAlign: 'center',
    backgroundColor: 'transparent',
    paddingLeft: '10px',
    paddingRight: '10px',
    borderRadius: '10px',
    paddingBottom: '10px',
    borderWidth: '4px',
    borderStyle: 'solid',
    borderColor: textColor,
  };
  const gridStyle : React.CSSProperties = {
    width: '50%',
    padding: '2px',
    textAlign: 'center',
    border: 'none',
    boxShadow: 'none',
  };
  const gridStyleLine : React.CSSProperties = {
    width: '50%',
    padding: '2px',
    textAlign: 'center',
    border: 'none',
    boxShadow: 'none',
    borderLeft: `1px solid ${textColor}`,
  };

  const stylesNumbers : React.CSSProperties = {
    textShadow: '',
    fontVariantNumeric: 'tabular-nums',
    color: textColor,
  };

  const numberBlink = (days: number, hours: number, minutes: number, seconds: number, completed: boolean): boolean => {
    let state = false;
   if ( !completed && days === 0 && hours === 0 && minutes === 0 && seconds <= 10) {
      state = true;
    }

    return state;
  };

  const renderer = ({ days, hours, minutes, seconds, completed } : CountdownRenderProps ) => {
    if (completed) {
      // Render a completed state
      return (
        <Row gutter={[0, 16]} justify='center' align='middle' style={{ height: '100%' }}>
          <Col span={24}>
            <Row justify='center' align='middle'>
              <Typography.Text strong style={{ textAlign: 'center', fontSize: '24px', color: textColor }}>
                {cEvent?.value?.countdownFinalMessage}
              </Typography.Text>
            </Row>
          </Col>
        </Row>
      );
    } else {
      // Render a countdown
      return (
        <Row gutter={[0, 16]} justify='center' align='middle' style={{ height: '100%' }}>
          <Col span={24}>
            <Row justify='center' align='middle'>
              <Typography.Text style={{ textAlign: 'center', fontSize: '18px', color: textColor }}>
                {cEvent?.value?.countdownMessage}
              </Typography.Text>
            </Row>
          </Col>
          <Col span={24}>
            <Typography.Text strong style={{ fontSize: '38px' }}>
              <Row gutter={[16, 16]} justify='center' align='middle'>
                <Col>
                  <Space direction='vertical' size={0} style={stylesContainerNumeric}>
                    <Typography.Text type='secondary' style={stylesSubtitle}>
                      Dias
                    </Typography.Text>
                    <Typography.Text style={stylesNumbers}>{zeroPad(days)}</Typography.Text>
                  </Space>
                </Col>

                <Col>
                  <Space direction='vertical' size={0} style={stylesContainerNumeric}>
                    <Typography.Text type='secondary' style={stylesSubtitle}>
                      Horas
                    </Typography.Text>
                    <Typography.Text style={stylesNumbers}>{zeroPad(hours)}</Typography.Text>
                  </Space>
                </Col>
                <Col>
                  <Space direction='vertical' size={0} style={stylesContainerNumeric}>
                    <Typography.Text type='secondary' style={stylesSubtitle}>
                      Minutos
                    </Typography.Text>
                    <Typography.Text style={stylesNumbers}>{zeroPad(minutes)}</Typography.Text>
                  </Space>
                </Col>
                <Col>
                  <Space direction='vertical' size={0} style={stylesContainerNumeric}>
                    <Typography.Text type='secondary' style={stylesSubtitle}>
                      Segundos
                    </Typography.Text>
                    <div
                      className={
                        numberBlink(days, hours, minutes, seconds, completed)
                          ? 'animate__animated animate__flash animate__fast animate__infinite'
                          : ''
                      }>
                      <Typography.Text style={stylesNumbers}>{zeroPad(seconds)}</Typography.Text>
                    </div>
                  </Space>
                </Col>
              </Row>
            </Typography.Text>
          </Col>
          <Col span={24}>
            <Row justify='center' align='middle'>
              <Card
                bordered={false}
                style={{
                  width: '350px',
                  borderRadius: '20px',
                  padding: '20px 0px',
                  backgroundColor: 'transparent',
                }}>
                <Card.Grid hoverable={false} style={gridStyle}>
                  <Space direction='vertical' style={{ color: textColor }}>
                    <CalendarFilled style={{ fontSize: '30px' }} />
                    {moment(date).format('ll')}
                  </Space>
                </Card.Grid>
                <Card.Grid hoverable={false} style={gridStyleLine}>
                  <Space direction='vertical' style={{ color: textColor }}>
                    <ClockCircleFilled style={{ fontSize: '30px' }} />
                    {moment(date).format('LT')}
                  </Space>
                </Card.Grid>
              </Card>
            </Row>
          </Col>
        </Row>
      );
    }
  };
  // @ts-ignore
  return dateLimitContador ?(<Countdown date={dateLimitContador.toString()} renderer={renderer} />) : (<></>);
};

export default CountdownBlock;
