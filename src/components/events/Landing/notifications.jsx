import React from 'react';

/** ant design */
import { notification } from 'antd';
import { WifiOutlined, PlayCircleOutlined, LoadingOutlined, DiffOutlined } from '@ant-design/icons';

function notifications(setNotification, viewNotification) {
   notification.open({
      message: `${viewNotification.message}`,
      description: viewNotification.description.map((notificationOpenSurveys, index) => {
         return (
            <>
               <h1 key={index}>
                  {index + 1}. {notificationOpenSurveys.name}
               </h1>
            </>
         );
      }),
      icon:
         viewNotification.type == 'open' ? (
            <WifiOutlined />
         ) : viewNotification.type == 'closed' ? (
            <LoadingOutlined />
         ) : viewNotification.type == 'ended' ? (
            <PlayCircleOutlined />
         ) : (
            <DiffOutlined />
         ),
      duration: viewNotification.type == 'open' ? 6 : 3,
      onClick:
         viewNotification.type == 'open'
            ? () => {
                 if (viewNotification.type == 'open') {
                    setNotification({
                       message: null,
                       type: null,
                    });
                 }
              }
            : viewNotification.type == 'survey'
            ? () => {
                //
                //this.props.gotoActivity(this.props.viewNotification.activity);
                //this.props.setCurrentSurvey(this.props.viewNotification.survey)
                // alert("CLICK SURVEY")
              }
            : null,
      onClose: () => {},
   });
}

export default notifications;
