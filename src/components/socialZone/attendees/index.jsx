import React, { useEffect, useState } from 'react';
import { List, Tooltip, Popover, Button, Skeleton, Switch, Card, Avatar } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined, MessageTwoTone } from '@ant-design/icons';

const { Meta } = Card;

const AttendeList = function(props) {
  let [popoverVisible, setpopoverVisible] = useState(false);

  const InitialsNameUser = (name) => {
    let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');
    let initials = [...name.matchAll(rgx)] || [];
    initials = ((initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')).toUpperCase();
    return initials;
  };

  const PopoverInfoUser = ({ item }) => {
    console.log({ ...item });
    return (
      <Skeleton loading={false} avatar active>
        <Meta
          avatar={<Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />}
          title={item.user.names}
          description={item.user.email}
        />
      </Skeleton>
    );
  };

  return (
    <List
      className='demo-loadmore-list'
      //loading={initLoading}
      itemLayout='horizontal'
      //loadMore={loadMore}
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
          {/* <Skeleton avatar title={false} loading={item.loading} active> */}
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
                <Popover content={<PopoverInfoUser item={item} />}>
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
          <div></div>
        </List.Item>
      )}
    />
  );
};

export default AttendeList;
