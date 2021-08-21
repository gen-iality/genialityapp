import React, { useEffect, useState, useContext } from 'react';
import { List, Tooltip, Popover, Avatar } from 'antd';
import { MessageTwoTone } from '@ant-design/icons';
import { InitialsNameUser } from '../hooks';
import PopoverInfoUser from '../hooks/Popover';
import InfiniteScroll from 'react-infinite-scroller';
import { UseCurrentUser } from '../../../Context/userContext';

const AttendeList = function(props) {
  //contextos
  let cUser = UseCurrentUser();
  let [myattendelist, setmyattendelist] = useState();
  let [loading, setLoading] = useState(false);
  let [page, setPage] = useState(0);
  let [filteredlist, setfilteredlist] = useState([]);
  let [hasMore, setHasMore] = useState(true);

  const pag = 15;

  useEffect(() => {
    let ordenadousers = [];

    Object.keys(props.attendeeList).map((key) => {
      let mihijo = {
        idattendpresence: key,
        iduser: props.attendeeList[key].account_id,
        name: props.attendeeList[key].properties.name,
        names: props.attendeeList[key].properties.names,
        status: props.attendeeListPresence[key] ? props.attendeeListPresence[key].state : 'offline',
        email: props.attendeeList[key].properties.email,
        properties: props.attendeeList[key].properties,
        _id:props.attendeeList[key]._id
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

  useEffect(() => {
    if (props.busqueda == undefined || props.busqueda == '') {
      myattendelist && setfilteredlist(myattendelist.slice(0, pag));
    } else {
      setfilteredlist(myattendelist.filter((a) => a.names.toLowerCase().includes(props.busqueda.toLowerCase())));
    }
  }, [props.busqueda]);

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

  const styleListAttende = {
    background: 'white',
    color: 'black',
    padding: 5,
    margin: 10,
    display: 'flex',
    border: '1px solid #cccccc',
    borderRadius: '8px',
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
            style={styleListAttende}
            actions={[
              cUser.value ? (
                <a
                  key='list-loadmore-edit'
                  onClick={() => {
                    props.createNewOneToOneChat(
                      cUser.value.uid,
                      cUser.value.names || cUser.value.name,
                      item.iduser,
                      item.names || item.name
                    );
                    props.settabselected('1');
                    props.setchattab('chat2');
                  }}>
                  <Tooltip title={'Chatear'}>
                    <MessageTwoTone style={{ fontSize: '27px' }} />
                  </Tooltip>
                </a>
              ) : null,
            ]}>
            <List.Item.Meta
              avatar={
                item.currentUser?.image ? (
                  <Avatar src={item.currentUser?.image} />
                ) : (
                  <Avatar style={{ backgroundColor: '#4A90E2', color: 'white' }} size={40}>
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
                  <a style={{ color: 'black' }} key='list-loadmore-edit'>
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
        )}></List>
    </InfiniteScroll>
  );
};

export default AttendeList;
