import React, { useEffect, useState } from 'react';
import { List, Tooltip, Popover, Avatar, Spin } from 'antd';
import { MessageTwoTone } from '@ant-design/icons';
import { InitialsNameUser } from '../hooks';
import PopoverInfoUser from '../hooks/Popover';
import InfiniteScroll from 'react-infinite-scroller';

import { UseCurrentUser } from '../../../Context/userContext';
import { UseEventContext } from '../../../Context/eventContext';

const AttendeList = function(props) {
  //contextos
  let cUser = UseCurrentUser();
  let cEvent = UseEventContext();

  let [myattendelist, setmyattendelist] = useState();

  let [loading, setLoading] = useState(false);
  let [page, setPage] = useState(0);
  let [filteredlist, setfilteredlist] = useState([]);
  let [hasMore, setHasMore] = useState(true);

  const pag = 15;

  useEffect(() => {
    if (props.busqueda == undefined || props.busqueda == '') {
      myattendelist && setfilteredlist(myattendelist.slice(0, pag));
    } else {
      setfilteredlist(myattendelist.filter((a) => a.names.toLowerCase().includes(props.busqueda.toLowerCase())));
    }
  }, [props.busqueda]);

  useEffect(() => {
    let ordenadousers = [];

    Object.keys(props.attendeeList).map((key) => {
      let mihijo = {
        idattendpresence: key,
        iduser: key,
        name: props.attendeeList[key].properties.name,
        names: props.attendeeList[key].properties.names,
        status: props.attendeeListPresence[key] ? props.attendeeListPresence[key].state : 'offline',
        email: props.attendeeList[key].properties.email,
      };

      if (mihijo.status === 'online') {
        ordenadousers.unshift(mihijo);
      } else if (mihijo.status === 'offline') {
        ordenadousers.push(mihijo);
      }
    });

    setmyattendelist(ordenadousers);

    setfilteredlist(ordenadousers.slice(0, pag));
    setPage(1);
  }, [props.attendeeListPresence, props.attendeeList]);

  const handleInfiniteOnLoad = () => {
    setLoading(true);
    setHasMore(true);

    if (filteredlist.length == myattendelist.length) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    let ini = pag * page;
    let fin = pag * page + pag;

    let newDatos = myattendelist.slice(ini, fin);
    const datosg = filteredlist.concat(newDatos);
    let pagP = page;
    pagP = pagP += 1;

    setfilteredlist(datosg);
    setPage(pagP++);
    //
    setLoading(false);
    setHasMore(true);
  };

  return (
    <InfiniteScroll
      initialLoad={false}
      pageStart={0}
      loadMore={handleInfiniteOnLoad}
      hasMore={!loading && hasMore}
      useWindow={false}>
      <List
        itemLayout='horizontal'
        dataSource={filteredlist && filteredlist}
        renderItem={(item) => (
          <List.Item
            actions={[
              cUser.value ? (
                <a
                  key='list-loadmore-edit'
                  onClick={() => {
                    props.createNewOneToOneChat(cUser.value.uid, cUser.value.names, item.iduser, item.names);
                    props.settabselected('1');
                    props.setCurrentChat(item.iduser, item.name ? item.name : item.names);
                    props.setchattab('chat2');
                  }}>
                  <Tooltip title={'Chatear'}>
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
                    {InitialsNameUser(item.names)}
                  </Avatar>
                )
              }
              title={
                <Popover
                  trigger='click'
                  style={{ padding: '0px !important', zIndex: 900 }}
                  placement='leftTop'
                  content={<PopoverInfoUser item={item} props={props} />}>
                  <a style={{ color: cEvent.value.styles.textMenu }} key='list-loadmore-edit'>
                    {item.names}
                  </a>
                </Popover>
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
        )}>
        {/* {loading && hasMore && (
          <div>
            <Spin size='large' />
          </div>
        )} */}
      </List>
    </InfiniteScroll>
  );
};

export default AttendeList;
