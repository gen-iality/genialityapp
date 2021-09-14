import React, { useEffect, useState, useContext } from 'react';
import { List, Tooltip, Popover, Avatar, Typography, Space, Tag } from 'antd';
import { MessageTwoTone } from '@ant-design/icons';
import { InitialsNameUser } from '../hooks';
import PopoverInfoUser from '../hooks/Popover';
import InfiniteScroll from 'react-infinite-scroller';
import { UseCurrentUser } from '../../../Context/userContext';
import { HelperContext } from '../../../Context/HelperContext';
import Record from '@2fd/ant-design-icons/lib/Record';
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
    imageforDefaultProfile, 
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
        imageProfile: attendeeList[key].user?.picture ? attendeeList[key].user?.picture : imageforDefaultProfile,
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
    color: '#333F44',
    padding: 5,
    margin: 4,
    display: 'flex',
    borderRadius: '5px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
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
                      item.names || item.name,
                      item.imageProfile
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
              avatar={<Avatar src={item.imageProfile} size={40} >
                 {!item.imageProfile && item.names ? item.names.charAt(0).toUpperCase() : item.names}
              </Avatar>}
              title={
                <Popover
                  trigger='hover'
                  style={{ padding: '0px !important', zIndex: 1000 }}
                  placement='leftTop'
                  content={<PopoverInfoUser item={item} props={props} />}>
                  <Typography.Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{ color: 'black', cursor: 'pointer', width: '90%', fontSize: '15px' }}
                    key='list-loadmore-edit'>
                    {item.names}
                  </Typography.Paragraph>
                </Popover>
              }
              description={
                item.status === 'online' ? (
                  <div style={{ color: '#52c41a', marginTop:'-10px' }}>
                    <Tag color='#52C41A'>Online</Tag>
                  </div>
                ) : (<div style={{ color: '#52c41a', marginTop:'-10px' }}>
                <Tag color='#CCCCCC'>Offline</Tag>
              </div>)
              }
            />
          </List.Item>
        )}></List>
    </InfiniteScroll>
  );
};

export default AttendeList;
