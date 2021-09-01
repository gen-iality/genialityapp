import React, { useEffect, useState, useContext } from 'react';
import { List, Tooltip, Popover, Avatar } from 'antd';
import { MessageTwoTone } from '@ant-design/icons';
import { InitialsNameUser } from '../hooks';
import PopoverInfoUser from '../hooks/Popover';
import InfiniteScroll from 'react-infinite-scroller';
import { UseCurrentUser } from '../../../Context/userContext';
import { HelperContext } from '../../../Context/HelperContext';
const AttendeList = function(props) {
  //contextos
  let cUser = UseCurrentUser();
  let [myattendelist, setmyattendelist] = useState();
  let [loading, setLoading] = useState(false);
  let [page, setPage] = useState(0);
  let [filteredlist, setfilteredlist] = useState([]);
  let [hasMore, setHasMore] = useState(true);
  let {
    createNewOneToOneChat,
    attendeeListPresence,
    attendeeList,
    HandleChatOrAttende,
    HandlePublicPrivate,
  } = useContext(HelperContext);
  const pag = 15;

  useEffect(() => {
    let ordenadousers = [];

    Object.keys(attendeeList).map((key) => {
      let mihijo = {
        uid: attendeeList[key].user !== null && attendeeList[key].user.uid,
        idattendpresence: key,
        iduser: attendeeList[key].account_id,
        name: attendeeList[key].properties.name,
        names: attendeeList[key].properties.names,
        status: attendeeListPresence[key] ? attendeeListPresence[key].state : 'offline',
        email: attendeeList[key].properties.email,
        properties: attendeeList[key].properties,
        _id: attendeeList[key]._id,
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
  }, [attendeeListPresence, attendeeList]);

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
                    createNewOneToOneChat(
                      cUser.value.uid,
                      cUser.value.names || cUser.value.name,
                      item.uid,
                      item.names || item.name
                    );
                    HandleChatOrAttende('1');
                    HandlePublicPrivate('private');
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
