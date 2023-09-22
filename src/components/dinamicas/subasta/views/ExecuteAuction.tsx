import { CloseCircleOutlined, PlayCircleOutlined, SaveOutlined, SelectOutlined, WarningOutlined } from '@ant-design/icons';
import {  Alert, Avatar, Button, Card, Col, Empty, List, Modal, Popconfirm, Result, Row, Skeleton, Statistic, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useState } from 'react';

import useProducts from '../hooks/useProducts';
import Loading from '@/components/profile/loading';
import { GeneralAuctionProps, IBids, Products } from '../interfaces/auction.interface';
import SelectProducts from '../components/cms/SelectProducts';
import { DispatchMessageService } from '@/context/MessageService';
import { saveAuctioFirebase } from '../services/Execute.service';
import { useBids } from '../hooks/useBids';
import { deleteOffersByProduct, updateProduct } from '../services';

export default function ExecuteAuction( {auction, eventId} : GeneralAuctionProps) {
  const [currentPage, setcurrentPage] = useState(1);
  const [visibility, setVisibility] = useState(false);
  const { products, loading, refresh } = useProducts(eventId);
  const { Bids, loading: Loadbids } = useBids(eventId, auction?.currentProduct?._id, auction?.playing);
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
          updateProduct(eventId, {...auction.currentProduct,price : Bids[0]?.offered ?? auction.currentProduct?.price , state: 'auctioned'})
        }
    }
  };
  const cancelBids = async () => {
    if (auction){ 
     const save = await saveAuctioFirebase(eventId, { ...auction, playing: false });
        if(save && auction.currentProduct){
          deleteOffersByProduct(eventId, auction.currentProduct._id)
        }
    }
  };
  const auctionFinish = async () => {
    if (auction) {
      await saveAuctioFirebase(eventId, { ...auction, currentProduct: null, playing: false });
    }
  };
  return (
    <div style={{ padding: 5 }}>
      { !auction.opened ? (
        <Row justify='center' align='middle' style={{width: '100%'}}>
          <Result status='warning' title={`La subasta no se encuentra abierta,${auction?.currentProduct ? ' para continuar' : ' para iniciarla'} debe abrirla primero`} />
        </Row>
      ) :
      <>
        <Row justify='end' gutter={[8, 8]} style={{ paddingBottom: 10 }}>
          {!auction?.playing && auction?.currentProduct && (
            <Col>
              <Popconfirm
                placement='top'
                title={'¿Está seguro de finalizar la subasta?'}
                onConfirm={auctionFinish}
                okText='Sí'
                cancelText='No'>
                <Button
                  type='primary'
                  danger
                  icon={<CloseCircleOutlined />}>
                  Finalizar subasta
                </Button>
              </Popconfirm>
            </Col>
          )}
          {!auction?.playing && (
            <Col>
              <Button
                type='primary'
                icon={auction?.currentProduct ? <SelectOutlined /> : <PlayCircleOutlined />}
                disabled={!auction?.opened}
                onClick={() => {
                  refresh();
                  setVisibility(true);
                }}>
                {auction?.currentProduct ? 'Seleccionar producto' : 'Iniciar subasta'}
              </Button>
            </Col>
          )}
          {auction?.playing && (
            <>
            <Col>
              <Popconfirm
                placement='top'
                title={'¿Está seguro de cancelar las pujas?'}
                onConfirm={cancelBids}
                okText='Sí'
                cancelText='No'>
                <Button
                  icon={<CloseCircleOutlined />}
                  danger
                  type='primary'>
                  Cancelar Pujas
                </Button>
              </Popconfirm>
            </Col>
            <Col>
              <Button
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
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card
              hoverable
              style={{ borderRadius: 20, cursor: 'auto' }}
              headStyle={{ textAlign: 'center' }}
              cover={
                auction?.currentProduct ? (
                  <img
                    alt='imagen del producto'
                    src={auction?.currentProduct.images[0].url}
                    style={{ height: '300px', objectFit: 'fill', backgroundColor: '#C4C4C440', borderRadius: '20px 20px 0 0px' }}
                  />
                ) : (
                  <Empty
                    image={<Skeleton.Image />}
                    style={{ height: '300px', display: 'grid', justifyContent: 'center', alignItems: 'center' }}
                    description={'Sin imagen'}
                  />
                )
              }
              >
                <Card.Meta 
                  description={<Typography.Text strong>{auction?.currentProduct ? auction?.currentProduct.name : 'Sin producto asignado'}</Typography.Text>}
                />
            </Card>
          </Col>

          <Col span={18}>
            <Card hoverable style={{ height: 450, borderRadius: 20, cursor: 'auto', overflowY: 'auto' }} className='desplazar'>
              {Bids.length > 0 ? (
                <List
                  style={{ height: '100%', paddingLeft: 30, paddingRight: 30 }}
                  loading={loading}
                  dataSource={Bids}
                  pagination={{
                  pageSize: 5,
                  current: currentPage,
                  onChange: (page) => setcurrentPage(page),
                  total: Bids.length,
                }}
                  renderItem={(bid) => (
                    <List.Item>
                      <Skeleton avatar title={false} loading={loading}>
                        <List.Item.Meta
                          avatar={<Avatar>{bid.name[0] || 'A'}</Avatar>}
                          title={
                            <Typography.Text>
                              {bid.name}
                            </Typography.Text>
                          }
                          description={
                            <Typography.Text>
                              {bid.date}
                            </Typography.Text>
                          }
                        />
                        <Statistic
                          value={bid.offered}
                          prefix='$'
                          suffix={auction.currency}
                        />
                      </Skeleton>
                    </List.Item>
                  )}
                />
              ) : (
                <Row justify='center' align='middle' style={{height: '100%'}}>
                  <Empty
                    description={'Sin información'}
                  />
                </Row>
              )}
            </Card>
          </Col>
        </Row>
      </>
      }
    </div>
  );
}
