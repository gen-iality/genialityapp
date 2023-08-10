import { CloseCircleOutlined, DeleteOutlined, PlayCircleOutlined, PlusOutlined, SaveOutlined, SelectOutlined, StopOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Empty, Modal, Row, Skeleton, Space, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useContext, useState } from 'react';

import useProducts from '../hooks/useProducts';
import { AuctionContext } from '../context/AuctionContext';
import Loading from '@/components/profile/loading';
import { IBids, Products } from '../interfaces/auction.interface';
import SelectProducts from '../components/cms/SelectProducts';
import { DispatchMessageService } from '@/context/MessageService';
import { saveAuctioFirebase } from '../services/Execute.service';
import { useBids } from '../hooks/useBids';
import { deleteOffers, updateProduct } from '../services';



const columns: ColumnsType<IBids> = [
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
    key: 'offered',
    title: 'Puja',
    dataIndex: 'offered',
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
    if (auction){ 
     const save = await saveAuctioFirebase(eventId, { ...auction, playing: false });
        if(save && auction.currentProduct){
          updateProduct(eventId, {...auction.currentProduct, state: 'auctioned'})
        }
    }
  };
  const cancelBids = async () => {
    if (auction){ 
     const save = await saveAuctioFirebase(eventId, { ...auction, playing: false });
        if(save && auction.currentProduct){
          deleteOffers(eventId, auction.currentProduct._id)
        }
    }
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
              icon={<CloseCircleOutlined />}
              onClick={auctionFinish}>
              Finalizar subasta
            </Button>
          )}
        </Col>
        <Col>
          {!auction?.playing && (
            <Button
              className='animate__animated animate__fadeInDown'
              type='primary'
              icon={auction?.currentProduct ? <SelectOutlined /> : <PlayCircleOutlined />}
              onClick={() => {
                refresh();
                setVisibility(true);
              }}>
              {auction?.currentProduct ? 'Seleccionar producto' : 'Iniciar subasta'}
            </Button>
          )}
        </Col>
        {auction?.playing && (
          <>
          <Col>
            <Button
              className='animate__animated animate__flip'
              onClick={cancelBids}
              icon={<CloseCircleOutlined />}
              danger
              type='primary'>
              Cancelar Pujas
            </Button>
          </Col>
          <Col>
            <Button
              className='animate__animated animate__flip'
              onClick={closeBids}
              icon={<SaveOutlined />}
              
              type='primary'>
              Guardar Pujas
            </Button>
          </Col>
          </>
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
            cover={
              auction?.currentProduct ? (
                <img
                  className='animate__animated animate__flipInX'
                  alt='imagen del producto'
                  src={auction?.currentProduct.images[0].url}
                  style={{ height: '370px', objectFit: 'fill', backgroundColor: '#C4C4C440', borderRadius: '20px 20px 0 0px' }}
                />
              ) : (
                <Empty
                  image={<Skeleton.Image className='animate__animated animate__flipInX' />}
                  style={{ height: '370px', display: 'grid', justifyContent: 'center', alignItems: 'center' }}
                  description={'Sin imagen'}
                />
              )
            }
            >
              <Card.Meta 
                title={<Typography.Text strong>{auction?.currentProduct ? auction?.currentProduct.name : 'Sin producto asignado'}</Typography.Text>}
              />
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
