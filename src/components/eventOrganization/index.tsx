import { Col, Row, Grid, Card } from 'antd';
import { withRouter } from 'react-router-dom';
import ModalLoginHelpers from '../authentication/ModalLoginHelpers';
import Loading from '../profile/loading';
import { OrganizationProps } from './types';
import { UseCurrentUser } from '@/context/userContext';
import { ModalCertificatesByOrganizacionAndUser } from './components/ModalCertificatesByOrganizacionAndUser';
import { SocialNetworks } from './components/SocialNetworks';
import { MyEvents } from './components/MyEvents';
import { NextEvents } from './components/NextEvents';
import { PassEvents } from './components/PassEvents';
import ContactInfo from './components/ContactInfo';
import useGetOrganizationData from '@/hooks/useGetOrganizationData';
import { useModalLogic } from '@/hooks/useModalLogic';
import useGetMyOrganizationUser from '@/hooks/useGetMyOrganizationUser';
import { useCallback } from 'react';

const { useBreakpoint } = Grid;

function EventOrganization({ match }: OrganizationProps) {
  const cUser = UseCurrentUser();
  const organizationId = match.params.id;
  const currentUserId = cUser.value?._id;
  const { organizationData } = useGetOrganizationData(organizationId);
  const { myOrgUser, isLoadingMyOrgUser } = useGetMyOrganizationUser(cUser.value?._id ? organizationId : '');
  const screens = useBreakpoint();
  const {
    closeModal: closeCertificates,
    openModal: openCertificates,
    isOpenModal: isOpenCertificates,
  } = useModalLogic();

  const showBlockEvents = useCallback(() => {
    //Si tiene org user y esta bloqueado se devuelve false, cualquier caso contrario se devuelve SHOW_BLOCK_EVENTS
    const SHOW_BLOCK_EVENTS = true;
    return (cUser?.value && myOrgUser !== null) ? myOrgUser?.active ?? SHOW_BLOCK_EVENTS : SHOW_BLOCK_EVENTS;
  }, [myOrgUser, cUser?.value]);
  

  return (
    <div
      style={{
        backgroundImage: `url(${organizationData?.styles?.BackgroundImage})`,
        backgroundColor: `${organizationData?.styles?.containerBgColor ?? '#FFFFFF'}`,
      }}>
      <SocialNetworks organization={organizationData} />
      <ModalLoginHelpers />
      {organizationData && !isLoadingMyOrgUser ? (
        <>
          {organizationData !== null && (
            <div style={{ width: '100%' }}>
              {organizationData.styles?.banner_image !== null || '' ? (
                <img
                  alt='banner'
                  style={{ objectFit: screens.xxl ? 'fill' : 'cover', width: '100%', maxHeight: '400px' }}
                  src={organizationData.styles?.banner_image}
                />
              ) : (
                ''
              )}
            </div>
          )}
          {showBlockEvents() ? (
            <Row style={{ padding: '30px' }} gutter={[0, 30]}>
              {cUser.value?._id && (
                <Col span={24}>
                  <MyEvents
                    myOrgUser={myOrgUser}
                    cUser={cUser}
                    organizationId={organizationId}
                    organization={organizationData}
                    openCertificates={openCertificates}
                  />
                  {isOpenCertificates && (
                    <ModalCertificatesByOrganizacionAndUser
                      destroyOnClose
                      visible={isOpenCertificates}
                      onCloseDrawer={closeCertificates}
                      eventUserId={cUser.value?._id}
                      organizationId={match.params.id}
                      orgContainerBg={organizationData?.styles?.containerBgColor}
                      orgTextColor={organizationData?.styles?.textMenu}
                    />
                  )}
                </Col>
              )}
              <Col span={24}>
                <PassEvents organizationId={organizationId} currentUserId={currentUserId} />
              </Col>
              <Col span={24}>
                <NextEvents organizationId={organizationId} />
              </Col>
            </Row>
          ) : (
            <Row justify='center' style={{ paddingTop: '32px', paddingBottom: '32px' }}>
              <Col xs={24} sm={24} md={20} lg={12} xl={12} xxl={12}>
                <Card style={{ width: '100%', borderRadius: 20, margin: '0 auto' }}>
                  <ContactInfo organization={organizationData} />
                </Card>
              </Col>
            </Row>
          )}
          {/* FOOTER */}
          {organizationData !== null && (
            <div style={{ width: '100%', maxHeight: '350px' }}>
              {organizationData.styles?.banner_footer || '' ? (
                <img
                  alt='Footer'
                  style={{ objectFit: 'cover', width: '100%', maxHeight: '250px' }}
                  src={organizationData.styles?.banner_footer}
                />
              ) : (
                ''
              )}
            </div>
          )}
        </>
      ) : (
        <div style={{ width: '100vw', height: '100vh', textAlign: 'center' }}>
          <Loading />
        </div>
      )}
    </div>
  );
}
export default withRouter(EventOrganization);
