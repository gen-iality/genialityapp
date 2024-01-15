import { useEffect, useState, memo } from 'react';
import { List } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { useHelper } from '../../../context/helperContext/hooks/useHelper';
import { UseCurrentUser } from '../../../context/userContext';
import UsersCard from '../../shared/usersCard';
import { imageforDefaultProfile } from '@/helpers/constants';
//import { knowMaleOrFemale } from '@/Utilities/knowMaleOrFemale';

const AttendeList = function(props) {
  //contextos
  let [myattendelist, setmyattendelist] = useState();
  let [loading, setLoading] = useState(false);
  let [page, setPage] = useState(0);
  let [filteredlist, setfilteredlist] = useState([]);
  let [hasMore, setHasMore] = useState(true);
  let { attendeeList, maleIcons, femaleicons } = useHelper();
  let cUser = UseCurrentUser();
  const page_size = 10;

  //Ajustamos la lista de los asistentes para poderla mostrar
  useEffect(() => {
    Object.keys(attendeeList).map((key) => {
      //Condición para solamente mostrar los que se han contectado en algún momento al evento
      //if (attendeeListPresence[key] != undefined || attendeeListPresence[key] != null) return;

      //Condición por si tenemos un asistente corrupto sin datos correctos
      if (!attendeeList[key].properties) return;

      //Ajustamos el formato de las propiedades de cada asistente para poder renderizar
      for (const property in attendeeList) {
        adapt_attendee_info(attendeeList[property], key);
      }
    });

    //Quitamos el usuario que se encuentra conectado para que no se vea el mismo
    //const userId = cUser.value._id;
    //const removeCurrentUserFromList = ordenadousers.filter((users) => users.iduser !== userId);
    //.sort(compare)
    setmyattendelist(Object.values({ ...attendeeList }));
    setfilteredlist(Object.values({ ...attendeeList }).slice(0, page_size));

    props.SetCountAttendeesOnline(
      //Object.values({ ...attendeeList }).filter((attendee) => attendee.status === 'online')
      Object.values({ ...attendeeList })
    );
  }, [attendeeList]);

  //Filtramos la lista de asistenes cuando se busca
  useEffect(() => {
    if (props.busqueda == undefined || props.busqueda == '') {
      myattendelist && setfilteredlist(myattendelist.slice(0, page_size));
    } else {
      setfilteredlist(myattendelist.filter((a) => a.names.toLowerCase().includes(props.busqueda.toLowerCase())));
    }
  }, [props.busqueda]);

  const handleInfiniteOnLoad = () => {
    setLoading(true);

    if (filteredlist.length >= myattendelist.length) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    let currentPage = page + 1;

    let newDatos = myattendelist.slice(currentPage * page_size, (currentPage + 1) * page_size);

    const datosg = [...filteredlist, ...newDatos];
    setfilteredlist(datosg);
    setPage(currentPage);
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
        renderItem={(item, key) => (
          <ItemAttende
            key={key}
            llave={key}
            item={item}
            status={item?.status}
            propsAttendees={item.properties}
            type={props.type}
          />
        )}></List>
    </InfiniteScroll>
  );
};

let ItemAttende = memo((props) => (
  <>
    <UsersCard type='attendees' {...props} />
  </>
));

// function compare(a, b) {
//   if (a.status == 'online') {
//     return -1;
//   }
//   if (b.status == 'online') {
//     return 1;
//   }
//   return 0;
// }

// function whatGenderIs(gender) {
//   // console.log('gender', gender);
//   const ramdonicon = Math.floor(Math.random() * femaleicons.length);
//   const ramdoniconmale = Math.floor(Math.random() * maleIcons.length);
//   return gender == 'male'
//     ? maleIcons[ramdoniconmale]
//     : gender == 'female'
//     ? femaleicons[ramdonicon]
//     : gender == 'unknown' && imageforDefaultProfile;
// }

function adapt_attendee_info(attende, key) {
  if (attende && !attende['uid']) attende['uid'] = attende.user !== null && attende.user.uid;
  if (attende && !attende['iduser']) attende['iduser'] = attende.account_id;
  if (attende && !attende['name']) attende['name'] = attende.properties?.name ?? attende.properties?.names;
  if (attende && !attende['names']) attende['names'] = attende.properties?.names ?? attende.properties?.name;
  if (attende && !attende['email']) attende['email'] = attende.properties.email;
  if (attende && !attende['iduser']) attende['iduser'] = attende.account_id;
  if (attende && !attende['properties']) attende['properties'] = attende.properties;
  if (attende && !attende['imageProfile'])
    attende['imageProfile'] = attende.properties.picture ?? imageforDefaultProfile;

  // ? attende.properties.picture
  // : whatGenderIs(knowMaleOrFemale(attende.properties.names && attende.properties.names.split(' ')[0])),
}

export default AttendeList;
