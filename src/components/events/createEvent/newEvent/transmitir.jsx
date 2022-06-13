import { Col, Modal, Row, List } from 'antd';
import { useEffect, useState } from 'react';
import { useContextNewEvent } from '../../../context/newEventContext';
import { OrganizationApi } from '../../../helpers/request';
import OptTranmitir from './optTransmitir';
import { DispatchMessageService } from '../../../context/MessageService';

function Transmitir(props) {
  const {
    changeTransmision,
    optTransmitir,
    changeOrganization,
    organization,
    selectOrganization,
    selectedOrganization,
    isbyOrganization,
    isLoadingOrganization,
  } = useContextNewEvent();
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    if (props.currentUser) {
      obtainOrganizations();
    }
    // console.log("ISBYORGANIZATION==>",isbyOrganization)

    async function obtainOrganizations() {
      if (!selectOrganization) {
        isLoadingOrganization(true);
        let organizations = await OrganizationApi.mine();
        if (organization.length == 0) {
          await createOrganization();
          organizations = await OrganizationApi.mine();
        }

        setOrganizations(organizations);
        selectedOrganization(organizations && organizations[0]);
        isLoadingOrganization(false);
      }
    }
  }, [props.currentUser]);

  const createOrganization = async () => {
    let newOrganization = {
      name: props.currentUser?.names || props.currentUser?.name,
    };
    //CREAR ORGANIZACION------------------------------
    let create = await OrganizationApi.createOrganization(newOrganization);
    console.log('CREATE==>', create);
    if (create) {
      return create;
    }
    return null;
  };

  const selectOrganizationOK = () => {
    if (!selectOrganization || selectOrganization == null) {
      DispatchMessageService({
        type: 'error',
        msj: 'Por favor seleccione una organización',
        action: 'show',
      });
    } else {
      changeOrganization(false);
    }
  };

  return (
    <>
      {optTransmitir == false ? (
        <div className='step-transmision'>
          <h1 className='title-step'>Transmitir desde GEN.iality</h1>
          <Row>
            <Col xs={24} sm={24} md={24} lg={10} xl={10} xxl={10}>
              <div className='container'>
                <div className='container-image'>
                  <img
                    style={{ width: '60%', margin: 'auto' }}
                    src='https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/ceEvius.png?alt=media&token=caecef6c-e177-47aa-bcd5-347c754fe409'
                    alt=''
                  />
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={14} xl={14} xxl={14}>
              <div className='container-description'>
                <div className='descriptions'>
                  <p>
                    Tu curso será transmitido desde evius usando tus camara y teniendo la posibilidad de agregar
                    efectos profesionales
                  </p>
                  {/*<a onClick={() => changeTransmision(true)}>Ver opciones de transmisión externas</a>*/}
                  {<a onClick={() => changeOrganization(true)}>Organización: {selectOrganization?.name}</a>}
                </div>
              </div>
            </Col>
          </Row>
          {organization && !isbyOrganization && (
            <Modal
              onOk={selectOrganizationOK}
              okText='Seleccionar'
              cancelText='Cerrar'
              title='Organización'
              visible={organization && !isbyOrganization}
              onCancel={() => changeOrganization(false)}>
              <List
                style={{ height: 400, overflowY: 'auto' }}
                size='small'
                bordered
                dataSource={organizations}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      cursor: 'pointer',
                      color: selectOrganization?.id == item.id ? 'white' : 'rgba(0, 0, 0, 0.85)',
                      background: selectOrganization?.id == item.id ? '#40a9ff' : 'white',
                    }}
                    onClick={() => selectedOrganization(item)}>
                    {item.name}
                  </List.Item>
                )}
              />
            </Modal>
          )}
        </div>
      ) : (
        <OptTranmitir />
      )}
    </>
  );
}

export default Transmitir;
