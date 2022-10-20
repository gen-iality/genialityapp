export function GetPermissionsEvent(
  cEvent: { value: { itemsMenu: [] } },
  cEventuser: { value: {} },
  seteventPrivate: any
) {
  if (cEvent.value != null) {
    const routePermissions: any =
      cEvent.value &&
      cEvent.value.itemsMenu &&
      Object.values(cEvent.value.itemsMenu)?.filter((item: { section: string }) => item.section === 'tickets');
    if (
      routePermissions &&
      routePermissions[0] &&
      routePermissions[0].permissions == 'assistants' &&
      cEventuser.value == null
    ) {
      seteventPrivate({
        private: true,
        section: 'permissions',
      });
    }
  }
}
