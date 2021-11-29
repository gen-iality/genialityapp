import ZoomOptions from './zoomOptions';
import { Button } from 'antd';
export default function PlatformZoomCreate({
  createZoomRoom,
  useAlreadyCreated,
  requiresCreateRoom,
  hasVideoconference,
  select_host_manual,
  handleChange,
  host_id,
  host_list,
}) {
  return (
    <>
      {requiresCreateRoom && (
        <ZoomOptions {...{ hasVideoconference, select_host_manual, handleChange, host_id, host_list }} />
      )}

      {!useAlreadyCreated && requiresCreateRoom && (
        <Button onClick={createZoomRoom} type='primary'>
          Crear nueva transmisión
        </Button>
      )}
    </>
  );
}
