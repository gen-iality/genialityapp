import React from 'react';
import { List, Tooltip, Popover, Avatar } from 'antd';
import { MessageTwoTone } from '@ant-design/icons';
import { InitialsNameUser } from '../hooks';
import PopoverInfoUser from '../hooks/Popover';

const AttendeList = function(props) {
  return (
    <List
      className='demo-loadmore-list'
      itemLayout='horizontal'
      dataSource={Object.keys(props.attendeeList).map((key) => {
        return { key: key, ...props.attendeeList[key] };
      })}
      renderItem={(item) => (
        <List.Item
          actions={[
            props.currentUser ? (
              <a
                key='list-loadmore-edit'
                onClick={() =>
                  props.createNewOneToOneChat(
                    props.currentUser.uid,
                    props.currentUser.names,
                    item.user.uid,
                    item.user.names
                  )
                }>
                <Tooltip title='Chatear'>
                  <MessageTwoTone style={{ fontSize: '20px' }} />
                </Tooltip>
              </a>
            ) : null,
          ]}>
          <List.Item.Meta
            avatar={
              item.currentUser?.image ? (
                <Avatar src={item.currentUser?.image} />
              ) : (
                <Avatar style={{ backgroundColor: '#4A90E2', color: 'white' }} size={30}>
                  {InitialsNameUser(item.properties.names)}
                </Avatar>
              )
            }
            title={
              props.currentUser ? (
                <Popover
                  style={{ padding: '0px !important' }}
                  placement='leftTop'
                  content={<PopoverInfoUser item={item} props={props} />}>
                  <a
                    key='list-loadmore-edit'
                    onClick={() =>
                      props.createNewOneToOneChat(
                        props.currentUser.uid,
                        props.currentUser.names,
                        item.user.uid,
                        item.user.names
                      )
                    }>
                    {item.properties.names}
                  </a>
                </Popover>
              ) : null
            }
            description={
              props.attendeeListPresence[item.key]?.state === 'online' ? (
                <h1 style={{ color: '#0CD5A1' }}>
                  <Avatar size={9} style={{ backgroundColor: '#0CD5A1' }}></Avatar> Online
                </h1>
              ) : (
                <h1 style={{ color: '#b5b5b5' }}>
                  {' '}
                  <Avatar size={9} style={{ backgroundColor: '#b5b5b5' }}></Avatar> Offline
                </h1>
              )
            }
          />
        </List.Item>
      )}
    />
  );
};

export default AttendeList;
