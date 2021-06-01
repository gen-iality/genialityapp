import React, { useEffect, useState } from 'react';
import { List, Tooltip, Popover, Avatar,  Spin } from 'antd';
import { MessageTwoTone } from '@ant-design/icons';
import { InitialsNameUser } from '../hooks';
import PopoverInfoUser from '../hooks/Popover';
import InfiniteScroll from 'react-infinite-scroller';

const AttendeList = function(props) {
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
      //Object.keys(props.attendeeListPresence).map((key2) => {
      //if (key2 === key) {
      let mihijo = {
        idattendpresence: key,
        iduser: key,
        name: props.attendeeList[key].properties.name,
        names: props.attendeeList[key].properties.names,
        status: props.attendeeListPresence[key] ? props.attendeeListPresence[key].state : 'offline',
        email: props.attendeeList[key].properties.email
      };

      if (mihijo.status === 'online') {
        ordenadousers.unshift(mihijo);
      } else if (mihijo.status === 'offline') {
        ordenadousers.push(mihijo);
      }
      //}
      //});
    });

    setmyattendelist(ordenadousers);

    setfilteredlist(ordenadousers.slice(0, pag));
    setPage(1);
  }, [props.attendeeListPresence, props.attendeeList]);

  const handleInfiniteOnLoad = () => {
    setLoading(true);
    setHasMore(true);

    if (filteredlist.length == myattendelist.length) {
      // message.warning('NO HAY MAS ASISTENTES');
      setHasMore(false);
      setLoading(false);
      return;
    }

    let ini = pag * page;
    let fin = pag * page + pag;
    //
    //

    let newDatos = myattendelist.slice(ini, fin);
    const datosg = filteredlist.concat(newDatos);
    let pagP = page;
    pagP = pagP += 1;
    //

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
              props.currentUser ? (
                <a
                  key='list-loadmore-edit'
                  onClick={() => {
                    props.createNewOneToOneChat(
                      props.currentUser.uid,
                      props.currentUser.names,
                      item.iduser,
                      item.names
                    );
                  }}>
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
                //props.currentUser ? (
                <Popover
                  trigger='click'
                  style={{ padding: '0px !important', zIndex: 900 }}
                  placement='leftTop'
                  content={<PopoverInfoUser item={item} props={props} />}>
                  <a
                    key='list-loadmore-edit'
                    /* onClick={() => {
                        var user = props.currentUser;
                        
                        
                        props.createNewOneToOneChat(user.uid, user.names, item.iduser, item.names);
                      }} */
                  >
                    {item.names}
                  </a>
                </Popover>
                //) : null
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
        {loading && hasMore && (
          <div>
            <Spin size='large' />
          </div>
        )}
      </List>
    </InfiniteScroll>
  );
};

export default AttendeList;
