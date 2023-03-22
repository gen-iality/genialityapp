/** React's libraries */
import { useState } from 'react';
import { connect } from 'react-redux';

/** Antd imports */
import { Button, Badge, Drawer, Space } from 'antd';
import { MessageOutlined, PieChartOutlined } from '@ant-design/icons';

/** Context */
import { useEventContext } from '@context/eventContext';

/** Components */
import SocialZone from '../../../socialZone/socialZone';

const MenuTabletsSocialZone = (props) => {
  const [isDrawerVisible, setisDrawerVisible] = useState(false);
  const [optionselected, setOptionselected] = useState('1');
  const cEvent = useEventContext();

  return (
    <>
      <div className="chat-evius_mobile  animate__animated animate__pulse animate__slower animate__infinite">
        <Space direction="horizontal" size="small">
          {(props.generalTabs?.publicChat || props.generalTabs?.privateChat || props.generalTabs?.attendees) && (
            <Button
              style={{ backgroundColor: cEvent.value.styles?.toolbarDefaultBg }}
              shape="circle"
              icon={
                <Badge count={props.totalNewMessages}>
                  <MessageOutlined style={{ fontSize: '20px', color: cEvent.value.styles?.textMenu }} />
                </Badge>
              }
              size="large"
              onClick={() => {
                setOptionselected('1');
                setisDrawerVisible(!isDrawerVisible);
              }}
            ></Button>
          )}
          {/* {props.currentActivity && (
            <Button
              style={{ backgroundColor: cEvent.value.styles?.toolbarDefaultBg }}
              shape="circle"
              icon={
                <Badge dot={props.hasOpenSurveys}>
                  <PieChartOutlined style={{ fontSize: '20px', color: cEvent.value.styles?.textMenu }} />
                </Badge>
              }
              size="large"
              onClick={() => {
                setOptionselected('3');
                setisDrawerVisible(!isDrawerVisible);
              }}
            ></Button>
          )} */}
        </Space>
      </div>

      <Drawer
        style={{ zIndex: '200' }}
        bodyStyle={{ backgroundColor: cEvent.value.styles?.toolbarDefaultBg }}
        height="90vh"
        placement="bottom"
        closable
        onClose={() => setisDrawerVisible(!isDrawerVisible)}
        visible={isDrawerVisible}
        maskClosable
        className="drawerMobile"
      >
        <SocialZone
          totalMessages={props.totalNewMessages}
          optionselected={optionselected}
          tab={1}
          generalTabs={props.generalTabs}
          currentActivity={props.currentActivity}
          mobile
        />
      </Drawer>
    </>
  );
};

const mapStateToProps = (state) => ({
  hasOpenSurveys: state.survey.data.hasOpenSurveys,
});

export default connect(mapStateToProps, null)(MenuTabletsSocialZone);
