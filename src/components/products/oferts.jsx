import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Row, Table, Tag } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import { withRouter } from 'react-router';
import API from '../../helpers/request';
import Header from '../../antdComponents/Header';

const OfertProduts = (props) => {
  const goBack = () => props.history.goBack();
  const [oferts, setOferts] = useState([]);

  useEffect(() => {
    if (props.eventId) {
      obtenerOrdenes();
    }
    async function obtenerOrdenes() {
      let data = await API.get(
        `api/events/${props.eventId}/orders/ordersevent?filtered=[{"field":"items","value":"${props.match.params.id}"}]`
      );

      if (data) {
        let orderOferts = data.data.data.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
        setOferts(orderOferts);
      }
    }
  }, [props.eventId]);

  const columns = [
    {
      title: 'Correo',
      dataIndex: 'email',
      key: 'email',
      render(text) {
        return <a>{text}</a>;
      },
    },
    {
      title: 'Nombre',
      dataIndex: 'first_name',
      key: 'name',
      render(value, item) {
        return (
          <>
            {item.first_name} {item.last_name}
          </>
        );
      },
    },
    {
      title: 'Fecha',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'Valor ofertado',
      key: 'amount',
      dataIndex: 'amount',
      render(price, item) {
        return (
          <>
            {' '}
            <Tag key={'amount-' + item._id}>{price}</Tag>
          </>
        );
      },
    },
  ];
  return (
    <>
      <Header title={'Ofertas de la obra'} back />
      <Table columns={columns} dataSource={oferts.length > 0 && oferts} />
      {/* <Row>
            <Button shape='circle' onClick={goBack} icon={<ArrowLeftOutlined />} />{' '}
            <span style={{ marginLeft: 30 }}>Ofertas de la obra</span>
          </Row>
          <Row style={{marginTop:30}}>
            <Table style={{width:'100%'}} columns={columns} dataSource={oferts.length>0 && oferts} />
          </Row> */}
    </>
  );
};

export default withRouter(OfertProduts);
