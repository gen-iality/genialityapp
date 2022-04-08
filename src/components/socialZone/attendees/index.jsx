import { useEffect, useState } from 'react';
import { List } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { useHelper } from '../../../context/helperContext/hooks/useHelper';
import { UseCurrentUser } from '../../../context/userContext';
import UsersCard from '../../shared/usersCard';
import { imageforDefaultProfile } from '@/helpers/constants';
import { knowMaleOrFemale } from '@/Utilities/knowMaleOrFemale';

const AttendeList = function(props) {
  //contextos
  let [myattendelist, setmyattendelist] = useState();
  let [loading, setLoading] = useState(false);
  let [page, setPage] = useState(0);
  let [filteredlist, setfilteredlist] = useState([]);
  let [hasMore, setHasMore] = useState(true);
  let { attendeeListPresence, attendeeList, maleIcons, femaleicons } = useHelper();
  let cUser = UseCurrentUser();
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
      if (attendeeListPresence[key] != undefined || attendeeListPresence[key] != null) {
        if (attendeeList[key].properties) {
          let attendeProfile = {
            uid: attendeeList[key].user !== null && attendeeList[key].user.uid,
            idattendpresence: key,
            iduser: attendeeList[key].account_id,
            name: attendeeList[key].properties?.name
              ? attendeeList[key].properties.name
              : attendeeList[key].properties?.names,
            names: attendeeList[key].properties?.names
              ? attendeeList[key].properties?.names
              : attendeeList[key].properties?.name,
            status: attendeeListPresence[key]
              ? attendeeListPresence[key]?.state
              : attendeeListPresence[key]?.last_changed
              ? attendeeListPresence[key]?.last_changed
              : 'offline',
            email: attendeeList[key].properties.email,
            properties: attendeeList[key].properties,
            _id: attendeeList[key]._id,
            imageProfile: attendeeList[key].properties.picture
              ? attendeeList[key].properties.picture
              : whatGenderIs(
                  knowMaleOrFemale(
                    attendeeList[key].properties.names && attendeeList[key].properties.names.split(' ')[0]
                  )
                ),
          };

          if (attendeProfile.status === 'online') {
            ordenadousers.unshift(attendeProfile);
          } else if (attendeProfile.status === 'offline') {
            ordenadousers.push(attendeProfile);
          }
        }
      }

      // imageProfile
    });
    const userId = cUser.value._id;
    const removeCurrentUserFromList = ordenadousers.filter((users) => users.iduser !== userId);
    setmyattendelist(removeCurrentUserFromList);
    setfilteredlist(removeCurrentUserFromList.slice(0, pag));
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

  return (
    <InfiniteScroll
      initialLoad={false}
      pageStart={0}
      loadMore={() => handleInfiniteOnLoad()}
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
