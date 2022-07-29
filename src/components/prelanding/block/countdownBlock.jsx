import { CurrentEventContext } from '@/context/eventContext';
import { Col, Grid, Row, Space, Typography } from 'antd';
import { useContext, useEffect, useState } from 'react';
import Countdown, { zeroPad } from 'react-countdown';

const { useBreakpoint } = Grid;

const CountdownBlock = () => {
  const screens = useBreakpoint();
  const cEvent = useContext(CurrentEventContext);
  const [dateLimitContador, setDateLimitContador] = useState(null);
  useEffect(() => {
    if (!cEvent.value) return;
    //PERMITE FORMATEAR LA FECHA PARA PODER INICIALIZAR EL CONTADOR
    const dateSplit = cEvent.value?.dateLimit ? cEvent.value?.dateLimit.split(' ') : ['2022-12-12', '10:00:00'];
    const dateFormat = dateSplit.join('T');
    setDateLimitContador(dateFormat);
  }, [cEvent.value]);

  const stylesSubtitle = {
    fontSize: '12px',
    textTransform: 'uppercase',
  };

  const stylesNumeric = {
    width: '120px',
    textAlign: 'center',
    backgroundColor: '#F9FAFE',
    paddingLeft: '10px',
    paddingRight: '10px',
    borderRadius: '10px',
    paddingBottom: '10px',
  };

  const numberBlink = (days, hours, minutes, seconds, completed) => {
    if (completed) {
      return false;
    } else {
      if (days === 0 && hours === 0 && minutes === 0 && seconds <= 10) {
        return true;
      }
    }
    return false;
  };

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return (
        <Row gutter={[0, 16]} justify='center' align='middle' style={{ height: '100%' }}>
          <Col span={24}>
            <Row justify='center' align='middle'>
              <Typography.Text strong style={{ textAlign: 'center' }}>
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
              <Typography.Text style={{ textAlign: 'center' }}>{cEvent?.value?.countdownMessage}</Typography.Text>
            </Row>
          </Col>
          <Col span={24}>
            <Typography.Text strong style={{ fontSize: '38px' }}>
              <Row gutter={[16, 16]} justify='center' align='middle'>
                <Col>
                  <Space direction='vertical' size={0} style={stylesNumeric}>
                    <Typography.Text type='secondary' style={stylesSubtitle}>
                      Dias
                    </Typography.Text>
                    <Typography.Text style={{ fontVariantNumeric: 'tabular-nums' }}>{zeroPad(days)}</Typography.Text>
                  </Space>
                </Col>

                <Col>
                  <Space direction='vertical' size={0} style={stylesNumeric}>
                    <Typography.Text type='secondary' style={stylesSubtitle}>
                      Horas
                    </Typography.Text>
                    <Typography.Text style={{ fontVariantNumeric: 'tabular-nums' }}>{zeroPad(hours)}</Typography.Text>
                  </Space>
                </Col>
                <Col>
                  <Space direction='vertical' size={0} style={stylesNumeric}>
                    <Typography.Text type='secondary' style={stylesSubtitle}>
                      Minutos
                    </Typography.Text>
                    <Typography.Text style={{ fontVariantNumeric: 'tabular-nums' }}>{zeroPad(minutes)}</Typography.Text>
                  </Space>
                </Col>
                <Col>
                  <Space direction='vertical' size={0} style={stylesNumeric}>
                    <Typography.Text type='secondary' style={stylesSubtitle}>
                      Segundos
                    </Typography.Text>
                    <div
                      className={
                        numberBlink(days, hours, minutes, seconds, completed)
                          ? 'animate__animated animate__flash animate__fast animate__infinite'
                          : ''
                      }>
                      <Typography.Text style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {zeroPad(seconds)}
                      </Typography.Text>
                    </div>
                  </Space>
                </Col>
              </Row>
            </Typography.Text>
          </Col>
        </Row>
      );
    }
  };
  return dateLimitContador ? <Countdown date={dateLimitContador.toString()} renderer={renderer} /> : null;
};

export default CountdownBlock;
