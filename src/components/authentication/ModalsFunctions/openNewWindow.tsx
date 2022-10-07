const openNewWindow = (url: string, eventId: string | null, canOpenNewWindow: boolean | null) => {
  const AuidEventID = '6334782dc19fe2710a0b8753';
  if (!url && !eventId && !canOpenNewWindow) return;
  // Se quema este id por el momento hasta que se evalue el flujo
  if (eventId !== AuidEventID) return;
  window.open(url, '_blank');
};

openNewWindow.defaultProps = {
  url: 'https://checkout.wompi.co/l/VPOS_N4aqRq',
  canOpenNewWindow: true,
};
export default openNewWindow;
