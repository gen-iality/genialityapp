
export interface OrganizationProps {
    history:  History;
    location: Location;
    match:    Match;
}

export interface History {
    length:   number;
    action:   string;
    location: Location;
}

export interface Location {
    pathname: string;
    search:   string;
    hash:     string;
}

export interface Match {
    path:    string;
    url:     string;
    isExact: boolean;
    params:  Params;
}

export interface Params {
    id: string;
}

export interface DataOrganizations {
    orgId?: string,
    view: boolean,
}

export interface contactOrg {
    email: string;
    celular: string;
}
export interface Organization {
    _id:            string;
    id:             string;
    name:           string;
    description?:   string
    styles:         Styles;
    created_at:     string;
    itemsMenu?:     any[] | ItemsMenuClass;
    show_my_certificates?:boolean
    social_networks?:SocialNetworksOrg,
    contact?: contactOrg
}

export interface SocialNetworksOrg {
    facebook:string;
    twitter:string;
    instagram:string;
    linkedln:string;
    youtube:string;
    yourSite:string;
}
export interface ItemsMenuClass {
    evento: Agenda;
    agenda: Agenda;
}

export interface Agenda {
    name:        string;
    position:    number;
    section:     string;
    icon:        string;
    checked:     boolean;
    label?:      any;
    permissions: string;
}

export interface Styles {
    buttonColor:         string;
    banner_color:        string;
    menu_color:          string;
    event_image:         any;
    banner_image:        any;
    menu_image:          any;
    banner_image_email:  any;
    footer_image_email:  string;
    brandPrimary:        string;
    brandSuccess:        string;
    brandInfo:           string;
    brandDanger:         string;
    containerBgColor:    string;
    brandWarning:        string;
    toolbarDefaultBg:    string;
    brandDark:           string;
    brandLight:          string;
    textMenu:            string;
    activeText:          string;
    bgButtonsEvent:      string;
    BackgroundImage:     any;
    FooterImage:         any;
    banner_footer:       any;
    mobile_banner:       any;
    banner_footer_email: any;
    show_banner:         string;
    show_card_banner:    boolean;
    show_inscription:    boolean;
    hideDatesAgenda:     boolean;
    hideDatesAgendaItem: boolean;
    hideHoursAgenda:     boolean;
    hideBtnDetailAgenda: boolean;
    loader_page:         string;

}

