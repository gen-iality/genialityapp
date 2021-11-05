import React, { useEffect, useState, useContext } from 'react';
import { List } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { HelperContext } from '../../../Context/HelperContext';
import UsersCard from '../../shared/usersCard';
import { firestore } from '../../../helpers/firebase';
import WithContext from '../../../Context/withContext';

const AttendeList = function(props) {
  //contextos
  const [attendes, setattendes] = useState([]);
  const [lastVisible, setlastVisible] = useState();

  let { attendeeListPresence, imageforDefaultProfile, knowMaleOrFemale, maleIcons, femaleicons } = useContext(
    HelperContext
  );

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

  // const fetchMoreData = () => {
  //   let last = this.state.last;
  //   var next = set.ref
  //     .collection('users')
  //     .startAfter(last)
  //     .limit(12);
  //   next.get().then(function(documentSnapshots) {
  //     // Get the last visible document
  //     var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
  //     const list = [];
  //     documentSnapshots.forEach(function(doc) {
  //       //im fetching only name and avatar url you can get any data
  //       //from your firestore as you like
  //       const { name, avatar_full_url } = doc.data();
  //       list.push({ key: doc.id, name, avatar_full_url });
  //     });
  //     //set state with updated array of data
  //     //also save last fetched data in state
  //     let updated_list = set.state.list.concat(list);
  //     set.setState({ list: updated_list, last: lastVisible });
  //   });
  // };

  function VerifyStatusUser(state) {
    return state == 'online' ? 'online' : state == 'offline' ? 'offline' : 'Desconectado';
  }

  useEffect(() => {
    let colletion_name = props.cEvent.value._id + '_event_attendees';

    function getUsers() {
      var first = firestore
        .collection(colletion_name)
        .orderBy('state_id', 'asc')
        .limit(12);
      let list = {};

      first.get().then(function(documentSnapshots) {
        var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];

        documentSnapshots.forEach(function(doc) {
          let attendee = doc.data();
          list[attendee.user?.uid] = { ...attendee };
        });

        //recorrer y mapear
        let userAttendes = [];

        Object.keys(list).forEach((key) => {
          let userAttende = {};
          userAttende = {
            ...list[key],
            status: VerifyStatusUser(attendeeListPresence[key] ? attendeeListPresence[key].state : null),
            names: list[key].user?.displayName,
          };
          userAttendes.push(userAttende);
        });
        console.log('userAttend', userAttendes);
        setattendes(userAttendes);
      });
    }

    getUsers();
  }, []);

  useEffect(() => {
    console.log('ordenadousers', attendes);
  }, [attendeeListPresence]);

  return (
    <InfiniteScroll
      initialLoad={false}
      pageStart={0}
      // loadMore={handleInfiniteOnLoad}
      // hasMore={!loading && hasMore}
      useWindow={false}>
      <List
        itemLayout='horizontal'
        dataSource={attendes}
        renderItem={(item) => <UsersCard type='attendees' item={item} propsAttendees={props} />}></List>
    </InfiniteScroll>
  );
};

export default WithContext(AttendeList);
