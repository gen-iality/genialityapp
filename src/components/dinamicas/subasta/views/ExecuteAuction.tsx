import { DeleteOutlined, PlusOutlined, SaveOutlined, StopOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Modal, Row, Skeleton, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useContext, useState } from 'react';

import useProducts from '../hooks/useProducts';
import { AuctionContext } from '../context/AuctionContext';
import Loading from '@/components/profile/loading';
import { Products } from '../interfaces/auction.interface';
import SelectProducts from '../components/cms/SelectProducts';
import { DispatchMessageService } from '@/context/MessageService';
import { saveAuctioFirebase } from '../services/Execute.service';
import { useBids } from '../hooks/useBids';

interface DataType {
  key: React.Key;
  name: string;
  date: string;
  offered_value: string;
}

const columns: ColumnsType<DataType> = [
  {
    key: 'date',
    title: 'Fecha',
    dataIndex: 'date',
    width: '30%',
  },
  {
    key: 'name',
    title: 'Nombre',
    dataIndex: 'name',
    width: '30%',
  },
  {
    key: 'offered_value',
    title: 'Puja',
    dataIndex: 'offered_value',
  },
];

export default function ExecuteAuction() {
  const [currentPage, setcurrentPage] = useState(1);
  const [visibility, setVisibility] = useState(false);
  const { eventId, auction } = useContext(AuctionContext);
  const { products, loading, refresh } = useProducts(eventId);
  const { Bids, setBids, loading: Loadbids } = useBids(eventId, auction?.currentProduct?._id, auction?.playing);
  const [selectedProduct, setselectedProduct] = useState<Products | null>(null);

  const startAuction = async () => {
    if (selectedProduct && auction) {
      setVisibility(false);
      await saveAuctioFirebase(eventId, { ...auction, currentProduct: selectedProduct, playing: true });
    } else {
      DispatchMessageService({
        type: 'warning',
        action: 'show',
        duration: 3,
        msj: 'Debe seleccionar un producto',
      });
    }
  };

  const onCancel = () => {
    setselectedProduct(null);
    setVisibility(false);
  };

  const closeBids = async () => {
    if (auction) await saveAuctioFirebase(eventId, { ...auction, playing: false });
  };
  const auctionFinish = async () => {
    if (auction) {
      await saveAuctioFirebase(eventId, { ...auction, currentProduct: null, playing: false });
      setBids([]);
    }
  };
  return (
    <div style={{ padding: 10 }}>
      <Row justify='end' gutter={[8, 8]} style={{ paddingBottom: 20 }}>
        <Col>
          {!auction?.playing && auction?.currentProduct && (
            <Button
              className='animate__animated animate__fadeInDown'
              type='primary'
              danger
              icon={<StopOutlined />}
              onClick={auctionFinish}>
              Finalizar Subasta
            </Button>
          )}
        </Col>
        <Col>
          {!auction?.playing && (
            <Button
              className='animate__animated animate__fadeInDown'
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => {
                refresh();
                setVisibility(true);
              }}>
              {auction?.currentProduct ? 'Seleccionar producto' : 'Iniciar Subasta'}
            </Button>
          )}
        </Col>
        {auction?.playing && (
          <Col>
            <Button
              className='animate__animated animate__flip'
              onClick={closeBids}
              icon={<DeleteOutlined />}
              danger
              type='primary'>
              Cerrar Pujas
            </Button>
          </Col>
        )}
        <Modal
          width={'60%'}
          title='Selecciona un producto'
          visible={visibility}
          onCancel={onCancel}
          cancelText={'Cancelar'}
          onOk={startAuction}
          okText={'Aceptar'}>
          {loading ? <Loading /> : <SelectProducts products={products} onclick={setselectedProduct} />}
        </Modal>
      </Row>
      <Row justify='center' gutter={[16, 16]}>
        <Col span={8}>
          <Card
            hoverable={true}
            style={{ height: 450, borderRadius: 20 }}
            headStyle={{ textAlign: 'center' }}
            title={auction?.currentProduct ? auction?.currentProduct.name : 'Sin producto asignado'}>
            <Space style={{ width: '100%', height: 300, justifyContent: 'center' }}>
              {auction?.currentProduct ? (
                <div
                  className='animate__animated animate__flipInX'
                  onClick={() => {}}
                  style={{
                    width: 310,
                    height: 320,
                    backgroundImage: `url(${auction?.currentProduct.images[0].url})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}></div>
              ) : (
                <Skeleton.Image className='animate__animated animate__flipInX' />
              )}
            </Space>
          </Card>
        </Col>

        <Col span={16}>
          <Card hoverable style={{ height: 450, borderRadius: 20 }}>
            <Table
              loading={Loadbids}
              columns={columns}
              dataSource={Bids}
              pagination={{
                pageSize: 5,
                current: currentPage,
                onChange: (page) => setcurrentPage(page),
                total: Bids.length,
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
