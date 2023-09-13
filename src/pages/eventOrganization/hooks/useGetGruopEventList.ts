import { useEffect, useState } from 'react';
import { GroupEvent } from '../interface/group.interfaces';

const data: GroupEvent[] = [
  {
    name: 'Finanzas',
    organizationId: 'f1e4fe4fef',
    _id: 'fd125e1f5e1f12e6f5e1f51efef',
  },
  {
    name: 'Deportes',
    organizationId: 'fefefe6+f264fe69',
    _id: 'fd125e1f5e1f1efef',
  },
];


export const useGetGruopEventList = (organizationId: string) => {
  const [groupEvent, setgroupEvent] = useState<GroupEvent[]>([]);
  const [isLoading, setisLoading] = useState(true);

  const getData = async () => {
    setgroupEvent(data);
    setisLoading(false);
  };

  useEffect(() => {
    getData();
  }, [organizationId]);

  return { isLoading, groupEvent };
};
