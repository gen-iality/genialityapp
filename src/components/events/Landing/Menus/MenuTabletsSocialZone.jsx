import { useState } from 'react';
import { Button, Badge, Drawer, Space } from 'antd';
import { MessageOutlined, PieChartOutlined } from '@ant-design/icons';
import SocialZone from '../../../socialZone/socialZone';
import { UseEventContext } from '../../../../context/eventContext';
import { connect } from 'react-redux';

const MenuTabletsSocialZone = (props) => {
  const [isDrawerVisible, setisDrawerVisible] = useState(false);
  let [optionselected, setOptionselected] = useState('1');
  let cEvent = UseEventContext();

  return (
    <>
      <div className='chat-evius_mobile  animate__animated animate__pulse animate__slower animate__infinite'>
        <Space direction='horizontal' size='small'>
          <Button
            style={{ backgroundColor: cEvent.value.styles?.toolbarDefaultBg }}
            shape='circle'
            icon={
              <Badge count={props.totalNewMessages}>
                <MessageOutlined style={{ fontSize: '20px', color: cEvent.value.styles?.textMenu }} />
              </Badge>
            }
            size='large'
            onClick={() => {
              setOptionselected('1');
              setisDrawerVisible(!isDrawerVisible);
            }}></Button>
          {props.currentActivity && (
            <Button
              style={{ backgroundColor: cEvent.value.styles?.toolbarDefaultBg }}
              shape='circle'
              icon={
                <Badge dot={props.hasOpenSurveys}>
                  <PieChartOutlined style={{ fontSize: '20px', color: cEvent.value.styles?.textMenu }} />
                </Badge>
              }
              size='large'
              onClick={() => {
                setOptionselected('3');
                setisDrawerVisible(!isDrawerVisible);
              }}></Button>
          )}
        </Space>
      </div>

      <Drawer
        /* style={{ zIndex: '200' }} */
        bodyStyle={{ backgroundColor: cEvent.value.styles?.toolbarDefaultBg }}
        /* height={'90vh'}
        placement='bottom' */
        width={'100%'}
        closable={true}
        onClose={() => setisDrawerVisible(!isDrawerVisible)}
        visible={isDrawerVisible}
        maskClosable={true}
        className='drawerMobile'>
        <SocialZone
          totalMessages={props.totalNewMessages}
          optionselected={optionselected}
          tab={1}
          generalTabs={props.generalTabs}
          currentActivity={props.currentActivity}
          mobile={true}
        />
      </Drawer>
    </>
  );
};

const mapStateToProps = (state) => ({
  hasOpenSurveys: state.survey.data.hasOpenSurveys,
});

export default connect(mapStateToProps, null)(MenuTabletsSocialZone);
