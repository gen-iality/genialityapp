import React, { useEffect, useState, useContext } from 'react';
import { List } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { HelperContext } from '../../../Context/HelperContext';
import UsersCard from '../../shared/usersCard';

const AttendeList = function(props) {
  //contextos
  let [myattendelist, setmyattendelist] = useState();
  let [loading, setLoading] = useState(false);
  let [page, setPage] = useState(0);
  let [filteredlist, setfilteredlist] = useState([]);
  let [hasMore, setHasMore] = useState(true);
  let {
    attendeeListPresence,
    attendeeList,
    imageforDefaultProfile,
    knowMaleOrFemale,
    maleIcons,
    femaleicons,
  } = useContext(HelperContext);
  const pag = 15;

  function whatGenderIs(gender) {
    // console.log('gender', gender);
    const ramdonicon = Math.floor(Math.random() * femaleicons.length);
    const ramdoniconmale = Math.floor(Math.random() * maleIcons.length);
    return gender == 'male'
      ? maleIcons[ramdoniconmale]
      : gender == 'female'
      ? femaleicons[ramdonicon]
      : gender == 'unknown' && imageforDefaultProfile;
  }

  useEffect(() => {
    let ordenadousers = [];

    Object.keys(attendeeList).map((key) => {
      if (attendeeListPresence[key]) {
        let attendeProfile = {
          uid: attendeeList[key].user !== null && attendeeList[key].user.uid,
          idattendpresence: key,
          iduser: attendeeList[key].account_id,
          name: attendeeList[key].properties.name,
          names: attendeeList[key].properties.names,
          status: attendeeListPresence[key]
            ? attendeeListPresence[key].state
            : attendeeListPresence[key].last_changed
            ? attendeeListPresence[key].last_changed
            : 'offline',
          email: attendeeList[key].properties.email,
          properties: attendeeList[key].properties,
          _id: attendeeList[key]._id,
          imageProfile:
            attendeeList[key].user.picture || attendeeList[key].properties.picture
              ? attendeeList[key].user.picture || attendeeList[key].properties.picture
              : whatGenderIs(
                  knowMaleOrFemale(
                    attendeeList[key].properties.names && attendeeList[key].properties.names.split(' ')[0]
                  )
                ),
        };

        // console.log("attendeeList[key].properties.picture",attendeeList[key].properties.picture)

        if (attendeProfile.status === 'online') {
          ordenadousers.unshift(attendeProfile);
        } else if (attendeProfile.status === 'offline') {
          ordenadousers.push(attendeProfile);
        }
      }

      // imageProfile
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
        renderItem={(item) => <UsersCard type='attendees' item={item} propsAttendees={props} />}></List>
    </InfiniteScroll>
  );
};

export default AttendeList;
