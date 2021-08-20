import { fireRealtime } from '../../../helpers/firebase';

export const monitorEventPresence = (event_id, attendeeListPresence, setAttendeeListPresence) => {

  console.log('====================================');
  console.log("viene",event_id,attendeeListPresence,setAttendeeListPresence);
  console.log('====================================');

  var eventpresenceRef = fireRealtime.ref('status/' + event_id);
  eventpresenceRef.on('value', (snapshot) => {
    const data = snapshot.val();

    console.log('====================================');
    console.log("datarealtime",data);
    console.log('====================================');
    let datalist = [];
    let attendeeListClone = { ...attendeeListPresence };

    console.log('====================================');
    console.log("attendeeListClone",attendeeListClone);
    console.log('====================================');
    if (data === null) return;

    Object.keys(data).map((key) => {
      let attendee = attendeeListClone[key] || {};
      attendee['state'] = data[key]['state'];
      attendee['last_changed'] = data[key]['last_changed'];
      attendeeListClone[key] = attendee;
      datalist.push(attendee);
    });
    setAttendeeListPresence(attendeeListClone);
  });
  return true;
};

export const InitialsNameUser = (name) => {
  let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');
  let initials = [...name.matchAll(rgx)] || [];
  initials = ((initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')).toUpperCase();
  return initials;
};
