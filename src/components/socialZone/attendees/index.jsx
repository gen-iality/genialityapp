import React, { useEffect } from 'react';
import { List, Avatar } from 'antd';

const AttendeList = function(props) {
  //   console.log(props.attendeeListPresence);
  useEffect(() => {
    let arrayuserss = [];

    arrayuserss.push(props.attendeeListPresence);
    console.log('array ordenado', arrayuserss.sort());
  });

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
                Chat
              </a>
            ) : null,
          ]}>
          {/* <Skeleton avatar title={false} loading={item.loading} active> */}
          <List.Item.Meta
            avatar={<Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />}
            title={
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
                  {item.properties.names}
                </a>
              ) : null
            }
            description={
              props.attendeeListPresence[item.key]?.state === 'online' ? (
                <h1 style={{ color: '#0CD5A1' }}>
                  <Avatar size={8} style={{ backgroundColor: '#0CD5A1' }}></Avatar> Online
                </h1>
              ) : (
                <h1 style={{ color: '#b5b5b5' }}>
                  {' '}
                  <Avatar size={8} style={{ backgroundColor: '#b5b5b5' }}></Avatar> Offline
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
