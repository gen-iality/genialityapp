import { DispatchMessageService } from '@/context/MessageService';
import { deleteLiveStream, deleteAllVideos } from '@/adaptors/gcoreStreamingApi';
import { AgendaApi } from '@/helpers/request';
import { firestore, fireRealtime } from '@/helpers/firebase';
import Service from '../roomManager/service';

import { handleRequestError } from '@/helpers/utils';

export default function useDeleteActivity () {
    const service = new Service(firestore);

    const deleteActivity = async (
      eventId: string,
      activityId: string,
      activityName: string,
    ) => {
    try {
      const refActivity = `request/${eventId}/activities/${activityId}`;
      const refActivityViewers = `viewers/${eventId}/activities/${activityId}`;
      const configuration = await service.getConfiguration(eventId, activityId);
      if (configuration && configuration.typeActivity === 'eviusMeet') {
        await deleteAllVideos(activityName, configuration.meeting_id);
        await deleteLiveStream(configuration.meeting_id);
      }
      await fireRealtime.ref(refActivity).remove();
      await fireRealtime.ref(refActivityViewers).remove();
      await service.deleteActivity(eventId, activityId);
      await AgendaApi.deleteOne(activityId, eventId);
      DispatchMessageService({
        type: 'loading', // Added by types
        msj: '', // Added by types
        key: 'loading',
        action: 'destroy',
      });
      DispatchMessageService({
        type: 'success',
        msj: 'Se eliminó la información correctamente!',
        action: 'show',
      });
    } catch (e) {
      DispatchMessageService({
        type: 'loading', // Added by types
        msj: '', // Added by types
        key: 'loading',
        action: 'destroy',
      });
      DispatchMessageService({
        type: 'error',
        msj: handleRequestError(e).message,
        action: 'show',
      });
    }
  };

  return deleteActivity;
}
