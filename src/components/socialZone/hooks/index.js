import { fireRealtime } from '../../../helpers/firebase';

export const monitorEventPresence = (event_id, attendeeListPresence, setAttendeeListPresence) => {
  var eventpresenceRef = fireRealtime.ref('status/' + event_id);
  eventpresenceRef.on('value', (snapshot) => {
    const data = snapshot.val();

    console.log('datafirebase clone', attendeeListClone, attendeeListPresence);

    let datalist = [];
    let attendeeListClone = { ...attendeeListPresence };

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
