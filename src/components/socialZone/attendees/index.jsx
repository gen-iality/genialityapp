import React, { useEffect, useState } from 'react';
import { List, Tooltip, Popover, Avatar } from 'antd';
import { MessageTwoTone } from '@ant-design/icons';
import { InitialsNameUser } from '../hooks';
import PopoverInfoUser from '../hooks/Popover';

const AttendeList = function(props) {
  let [myattendelist, setmyattendelist] = useState();

  useEffect(() => {
    let usersorderbystatus = [];
    let ordenadousers = [];
    console.log(props.attendeeList);
    console.log(props.attendeeListPresence);

    Object.keys(props.attendeeList).map((key) => {
      Object.keys(props.attendeeListPresence).map((key2) => {
        if (key2 === key) {
          let mihijo = {
            idattendpresence: key2,
            iduser: key,
            name: props.attendeeList[key].properties.name,
            names: props.attendeeList[key].properties.names,
            status: props.attendeeListPresence[key2].state,
            email: props.attendeeList[key].properties.email
          };
          console.log('si es igual', mihijo);
          usersorderbystatus.push(mihijo);
        }
      });
    });

    usersorderbystatus.map((user) => {
      if (user.status === 'online') {
        ordenadousers.unshift(user);
      } else if (user.status === 'offline') {
        ordenadousers.push(user);
      }
    });
    setmyattendelist(ordenadousers);
  }, [props.attendeeList]);

  return (
    <List
      className='demo-loadmore-list'
      itemLayout='horizontal'
      dataSource={myattendelist && myattendelist}
      renderItem={(item) => (
        <List.Item
          actions={[
            props.currentUser ? (
              <a
                key='list-loadmore-edit'
                onClick={() =>
                  props.createNewOneToOneChat(props.currentUser.uid, props.currentUser.names, item.iduser, item.names)
                }>
                <Tooltip title={'Chatear'}>
                  <MessageTwoTone style={{ fontSize: '20px' }} />
                </Tooltip>
              </a>
            ) : null
          ]}>
          <List.Item.Meta
            avatar={
              item.currentUser?.image ? (
                <Avatar src={item.currentUser?.image} />
              ) : (
                <Avatar style={{ backgroundColor: '#4A90E2', color: 'white' }} size={30}>
                  {InitialsNameUser(item.names)}
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
                    {item.names}
                  </a>
                </Popover>
              ) : null
            }
            description={
              item.status === 'online' ? (
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
