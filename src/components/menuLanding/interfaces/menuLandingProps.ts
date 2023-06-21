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
  label: string
  [key: string]: string | number | boolean;
}
export interface MenuBase {
  [key: string]: MenuItem;
}
export interface MenuLanding {
  _id: string;
}


export interface Menu {
  key:string;
  position: number;
  name: string;
  label? : string
  icon: string;
  checked: boolean;
  options: JSX.Element;
};

export interface PropsEditModal {
  item: Menu,
  loading: boolean,
  handleCancel: () => void
  handleOk: (data : any) => void
  visibility : boolean
  setItemEdit : React.Dispatch<React.SetStateAction<Menu>>
}