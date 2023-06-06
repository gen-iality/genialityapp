export interface MenuLandingProps {
  organizationObj: {
    _id: string;
    itemsMenu: {
      [key: string]: MenuItem;
    };
  };

  organization: number;
  event: {
    _id: string;
    itemsMenu: {
      [key: string]: MenuItem;
    };
    visibility: string;
  };
}
export interface MenuItem {
  name: string;
  position: number;
  section: string;
  icon: string;
  checked: boolean;
  permissions: string;
  [key: string]: string | number | boolean;
}
export interface MenuBase {
  [key: string]: MenuItem;
}
export interface MenuLanding {
  _id: string;
}


