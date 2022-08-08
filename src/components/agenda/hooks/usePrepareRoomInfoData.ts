export default function usePrepareRoomInfoData (context: any) {
  const {
    roomStatus,
    platform,
    meeting_id,
    chat,
    surveys,
    games,
    attendees,
    host_id,
    host_name,
    avalibleGames,
    transmition,
    isPublished,
    typeActivity,
  } = context;

  const roomInfo = {
    platform,
    meeting_id,
    isPublished: !!isPublished,
    host_id,
    host_name,
    avalibleGames,
    habilitar_ingreso: roomStatus,
    transmition: transmition || null,
    typeActivity,
  };

  const tabs = { chat, surveys, games, attendees };
  return { roomInfo, tabs };
}
