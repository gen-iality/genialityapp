export const ApiUrl = process.env.VITE_API_URL;
export const ApiDEVUrl = process.env.VITE_API_DEV_URL;
export const AuthUrl = process.env.VITE_APP_AUTH_URL;
export const BaseUrl = process.env.VITE_APP_BASE_URL;
export const EVIUS_GOOGLE_MAPS_KEY = process.env.EVIUS_GOOGLE_MAPS_KEY || 'AIzaSyCmcIJ4xnytwh5ToGhN1Pl56RiualarBqk';
export const ApiEviusZoomServer = process.env.VITE_APP_API_EVIUS_ZOOM_SERVER;
export const ApiGoogleDocuments = process.env.VITE_APP_API_GOOGLE_API_DOCUMENTS;
export const ApiEviusZoomHosts = process.env.VITE_APP_API_EVIUS_ZOOM_HOSTS;
export const ApiEviusZoomSurvey = process.env.VITE_APP_API_EVIUS_ZOOM_SURVEY;

export const parseUrl = (url) => {
  try {
    let temporal = {};
    url
      .split('?')[1]
      .split('&')
      .map((obj) => {
        return (temporal[obj.split('=')[0]] = obj.split('=')[1]);
      });
    return temporal;
  } catch (error) {
    return {};
  }
};
export const parseCookies = (cookies) => {
  let temporal = [];
  cookies.split('&').map((obj) => {
    return temporal.push({ [obj.split('=')[0]]: obj.split('=')[1] });
  });
  return temporal;
};
export const networks = [
  {
    name: 'Facebook',
    path: 'facebook',
    icon: <i className='fab fa-facebook'></i>,
  },
  {
    name: 'Twitter',
    path: 'twitter',
    icon: <i className='fab fa-twitter'></i>,
  },
  {
    name: 'Instagram',
    path: 'instagram',
    icon: <i className='fab fa-instagram'></i>,
  },
  {
    name: 'LinkedIn',
    path: 'linkedIn',
    icon: <i className='fab fa-linkedin'></i>,
  },
];
export const rolPermissions = {
  admin_activity: {
    _id: '60a5256e5f7827f40e29ff6a',
    name: 'Administrar lección/Anfitrión de la lección',
  },
  admin_ticket: {
    _id: '5c09261df33bd415e22dcdb2',
    name: 'Tiquetes',
  },
  admin_staff: {
    _id: '5c192400f33bd41b9070cb34',
    name: 'Asignación de roles para el curso',
  },
  admin_invitations: {
    _id: '5c192410f33bd41b9070cb36',
    name: 'Administrar invitaciones',
  },
  admin_badge: {
    _id: '5c192450f33bd450a6022e36',
    name: 'Modificación de la escarapela',
  },
  checkin: {
    _id: '5c19242ff33bd46c102ec975',
    name: 'Realización del checking',
  },
  add_attendees: {
    _id: '5c192408f33bd41b9070cb35',
    name: 'Agregar asistente',
  },
  update_attendees: {
    _id: '5c19243cf33bd450a6022e33',
    name: 'Actualización de datos del asistente',
  },
  delete_attendees: {
    _id: '5c192443f33bd450a6022e34',
    name: 'Eliminar asistente',
  },
  print_attendees: {
    _id: '5c19244af33bd450a6022e35',
    name: 'Impresión de la escarapela del asistente',
  },
  history_invitations: {
    _id: '5c192428f33bd46c102ec974',
    name: 'Historial de las invitaciones enviadas',
  },
  metrics: {
    _id: '5c092624f33bd415e22dcdb3',
    name: 'Metricas del curso',
  },
};
export const typeInputs = [
  { value: '', label: 'Seleccione una opción' },
  { value: 'text', label: 'Texto' },
  { value: 'country', label: 'Pais ' },
  { value: 'region', label: 'Region ' },
  { value: 'city', label: 'Ciudad ' },
  { value: 'longtext', label: 'Texto largo' },
  { value: 'email', label: 'Correo' },
  { value: 'number', label: 'Numérico' },
  { value: 'list', label: 'Lista opciones' },
  { value: 'multiplelist', label: 'Selección multiple' },
  { value: 'date', label: 'Fecha (DD/MM/YYYY)' },
  { value: 'boolean', label: 'Si/No' },
  { value: 'file', label: 'Archivo' },
  { value: 'complex', label: 'JSON' },
  { value: 'tituloseccion', label: 'Titulo para indicar campos relacionados' },
  { value: 'password', label: 'Password' },
  { value: 'multiplelisttable', label: 'Selección multiple con buscar' },
  { value: 'codearea', label: 'Código de área para números' },
  { value: 'onlyCodearea', label: 'Código de área sin teléfono' },
  /* { value: 'avatar', label: 'Imagen de perfil' }, */
];
export const toolbarEditor = {
  toolbar: [
    [{ font: [] }],
    [{ header: [0, 1, 2, 3] }],
    [{ size: [] }],
    [{ align: [] }],
    [{ syntax: true }],
    ['bold', 'italic', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
  ],
};

export const imageBox =
  '<svg id="Layer_1" style="enable-background:new 0 0 64 64;" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><style type="text/css">\n' +
  '\t.st0{fill:#134563;}\n' +
  '</style><g><g id="Icon-Image" transform="translate(278.000000, 232.000000)"><path class="st0" d="M-226.2-181.6h-39.5c-2.3,0-4.2-1.9-4.2-4.2v-28.2c0-2.3,1.9-4.2,4.2-4.2h39.5     c2.3,0,4.2,1.9,4.2,4.2v28.2C-222-183.5-223.9-181.6-226.2-181.6L-226.2-181.6z M-265.8-215.5c-0.8,0-1.4,0.6-1.4,1.4v28.2     c0,0.8,0.6,1.4,1.4,1.4h39.5c0.8,0,1.4-0.6,1.4-1.4v-28.2c0-0.8-0.6-1.4-1.4-1.4H-265.8L-265.8-215.5z" id="Fill-12"/><path class="st0" d="M-238.9-201.5c-3.1,0-5.5-2.5-5.5-5.5s2.5-5.5,5.5-5.5s5.5,2.5,5.5,5.5     S-235.9-201.5-238.9-201.5L-238.9-201.5z M-238.9-210c-1.6,0-2.9,1.3-2.9,2.9c0,1.6,1.3,2.9,2.9,2.9c1.6,0,2.9-1.3,2.9-2.9     C-236-208.7-237.3-210-238.9-210L-238.9-210z" id="Fill-13"/><polyline class="st0" id="Fill-14" points="-231.4,-182.1 -254.5,-203.8 -267.7,-191.6 -269.5,-193.5 -254.5,-207.4 -229.6,-184      -231.4,-182.1    "/><polyline class="st0" id="Fill-15" points="-224.2,-189.3 -231.9,-195.5 -238.3,-190.2 -240,-192.3 -231.9,-198.9 -222.6,-191.3      -224.2,-189.3    "/></g></g></svg>';

export const icon =
  '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n' +
  '\t viewBox="0 0 1128 193" style="enable-background:new 0 0 1128 193;" xml:space="preserve">\n' +
  '<g>\n' +
  '\t<path style="fill:#50D3C9" d="M318.4,8.6l-68,174.7c-0.8,2.3-2,3.1-4.3,3.1h-4.8c-2.5,0-3.6-0.8-4.3-2.8l-68-175c-0.8-1.8-0.3-3.1,2-3.1h4.8\n' +
  '\t\tc3.8,0,4.8,0.5,5.6,2.8l56.6,146.4c2.3,6.4,4.3,13.8,5.6,17.1h0.8c1.3-3.3,3.1-10.4,5.3-17.1L305.9,8.4c0.8-2.3,2-2.8,5.6-2.8h4.8\n' +
  '\t\tC318.9,5.6,319.2,6.8,318.4,8.6"/>\n' +
  '\t<path style="fill:#50D3C9" d="M396.8,5.6h5.3c2.3,0,3.1,0.8,3.1,3.3v174.2c0,2.5-0.8,3.3-3.1,3.3h-5.3c-2.6,0-3.3-0.8-3.3-3.3V8.9\n' +
  '\t\tC393.5,6.3,394.3,5.6,396.8,5.6"/>\n' +
  '\t<path style="fill:#50D3C9" d="M563.6,179.3c37.2,0,55.3-21.1,55.3-54V8.9c0-2.5,0.8-3.3,3.1-3.3h5.6c2.3,0,3.1,0.8,3.1,3.3v116.4\n' +
  '\t\tc0,39.5-22.1,64.9-67,64.9c-45.1,0-67.2-25.5-67.2-64.9V8.9c0-2.5,0.8-3.3,3.3-3.3h5.3c2.3,0,3.1,0.8,3.1,3.3v116.4\n' +
  '\t\tC508.1,158.1,526.1,179.3,563.6,179.3"/>\n' +
  '\t<path style="fill:#50D3C9" d="M779,2c34.1,0,53.5,12.5,66.7,39.5c1.3,2.3,0.5,3.6-1.5,4.3l-5.1,2.3c-2,0.8-2.8,0.8-4.1-1.5\n' +
  '\t\tc-11.5-22.7-27.5-33.4-56-33.4c-32.9,0-52,14.3-52,38.7c0,30.1,28.3,34.9,57.1,38c31.1,3.6,63.4,8.9,63.4,48.1\n' +
  '\t\tc0,33.1-22.9,52-67.2,52c-35.7,0-56.3-14.3-68.5-44.6c-1-2.6-0.8-3.6,1.8-4.6l4.8-1.8c2.3-0.8,3.1-0.5,4.3,2\n' +
  '\t\tc11,25.7,29,37.7,57.6,37.7c36.7,0,55.5-13.2,55.5-40.2c0-30-26.5-33.9-54.2-37.2c-31.8-3.8-66.5-9.2-66.5-48.6\n' +
  '\t\tC715,21.6,738.7,2,779,2"/>\n' +
  '\t<path style="fill:#50D3C9" d="M108.2,17.8H3.7C3.3,17.8,3,17.4,3,17V5.8C3,5.4,3.3,5,3.7,5h104.4c0.4,0,0.7,0.3,0.7,0.7V17\n' +
  '\t\tC108.9,17.4,108.6,17.8,108.2,17.8"/>\n' +
  '\t<path style="fill:#50D3C9" d="M108.2,102.3H3.7c-0.4,0-0.7-0.3-0.7-0.7V90.3c0-0.4,0.3-0.7,0.7-0.7h104.4c0.4,0,0.7,0.3,0.7,0.7v11.2\n' +
  '\t\tC108.9,101.9,108.6,102.3,108.2,102.3"/>\n' +
  '\t<path style="fill:#50D3C9" d="M108.2,186.8H3.7c-0.4,0-0.7-0.3-0.7-0.7v-11.2c0-0.4,0.3-0.7,0.7-0.7h104.4c0.4,0,0.7,0.3,0.7,0.7V186\n' +
  '\t\tC108.9,186.5,108.6,186.8,108.2,186.8"/>\n' +
  '\t<rect x="3" y="161.3" style="fill:#50D3C9" width="12.7" height="15.4"/>\n' +
  '\t<text transform="matrix(1 0 0 1 871.8398 189.939)"><tspan x="0" y="0" style="fill:#50D3C9;font-family:\'Montserrat\';font-size:122.7092px;letter-spacing:24;">.C</tspan><tspan x="159.4" y="0" style="fill:#50D3C9;font-family:\'Montserrat\';font-size:122.7092px;letter-spacing:24;">O</tspan></text>\n' +
  '</g>\n' +
  '</svg>';

//new constants dolph

export const fakeEventTimetable = {
  '2020-09-24': [
    {
      timestamp_start: '2020-09-24T21:00:00Z',
      timestamp_end: '2020-09-24T21:15:00Z',
    },
    {
      timestamp_start: '2020-09-24T21:15:00Z',
      timestamp_end: '2020-09-24T21:30:00Z',
    },
    {
      timestamp_start: '2020-09-24T21:30:00Z',
      timestamp_end: '2020-09-24T21:45:00Z',
    },
    {
      timestamp_start: '2020-09-24T21:45:00Z',
      timestamp_end: '2020-09-24T22:00:00Z',
    },
    {
      timestamp_start: '2020-09-24T22:00:00Z',
      timestamp_end: '2020-09-24T22:15:00Z',
    },
    {
      timestamp_start: '2020-09-24T22:15:00Z',
      timestamp_end: '2020-09-24T22:30:00Z',
    },
    {
      timestamp_start: '2020-09-24T22:30:00Z',
      timestamp_end: '2020-09-24T22:45:00Z',
    },
    {
      timestamp_start: '2020-09-24T22:45:00Z',
      timestamp_end: '2020-09-24T23:00:00Z',
    },
  ],
};

export const areaCode = [
  {
    name_en: 'Afghanistan',
    label: 'Afganistán',
    value: '+93',
    code: 'AF',
  },
  {
    name_en: 'Albania',
    label: 'Albania',
    value: '+355',
    code: 'AL',
  },
  {
    name_en: 'Algeria',
    label: 'Argelia',
    value: '+213',
    code: 'DZ',
  },
  {
    name_en: 'AmericanSamoa',
    label: 'Samoa Americana',
    value: '+1684',
    code: 'AS',
  },
  {
    name_en: 'Andorra',
    label: 'Andorra',
    value: '+376',
    code: 'AD',
  },
  {
    name_en: 'Angola',
    label: 'Angola',
    value: '+244',
    code: 'AO',
  },
  {
    name_en: 'Anguilla',
    label: 'Anguilla',
    value: '+1264',
    code: 'AI',
  },
  {
    name_en: 'Antarctica',
    label: 'Antártida',
    value: '+672',
    code: 'AQ',
  },
  {
    name_en: 'Antigua and Barbuda',
    label: 'Antigua y Barbuda',
    value: '+1268',
    code: 'AG',
  },
  {
    name_en: 'Argentina',
    label: 'Argentina',
    value: '+54',
    code: 'AR',
  },
  {
    name_en: 'Armenia',
    label: 'Armenia',
    value: '+374',
    code: 'AM',
  },
  {
    name_en: 'Aruba',
    label: 'Aruba',
    value: '+297',
    code: 'AW',
  },
  {
    name_en: 'Australia',
    label: 'Australia',
    value: '+61',
    code: 'AU',
  },
  {
    name_en: 'Austria',
    label: 'Austria',
    value: '+43',
    code: 'AT',
  },
  {
    name_en: 'Azerbaijan',
    label: 'Azerbaiyán',
    value: '+994',
    code: 'AZ',
  },
  {
    name_en: 'Bahamas',
    label: 'Bahamas',
    value: '+1242',
    code: 'BS',
  },
  {
    name_en: 'Bahrain',
    label: 'Baréin',
    value: '+973',
    code: 'BH',
  },
  {
    name_en: 'Bangladesh',
    label: 'Banglades',
    value: '+880',
    code: 'BD',
  },
  {
    name_en: 'Barbados',
    label: 'Barbados',
    value: '+1246',
    code: 'BB',
  },
  {
    name_en: 'Belarus',
    label: 'Bielorrusia',
    value: '+375',
    code: 'BY',
  },
  {
    name_en: 'Belgium',
    label: 'Bélgica',
    value: '+32',
    code: 'BE',
  },
  {
    name_en: 'Belize',
    label: 'Belice',
    value: '+501',
    code: 'BZ',
  },
  {
    name_en: 'Benin',
    label: 'Benin',
    value: '+229',
    code: 'BJ',
  },
  {
    name_en: 'Bermuda',
    label: 'Bermudas',
    value: '+1441',
    code: 'BM',
  },
  {
    name_en: 'Bhutan',
    label: 'Butan',
    value: '+975',
    code: 'BT',
  },
  {
    name_en: 'Bolivia',
    label: 'Bolivia',
    value: '+591',
    code: 'BO',
  },
  {
    name_en: 'Bosnia and Herzegovina',
    label: 'Bosnia-Herzegovina',
    value: '+387',
    code: 'BA',
  },
  {
    name_en: 'Botswana',
    label: 'Botsuana',
    value: '+267',
    code: 'BW',
  },
  {
    name_en: 'Brazil',
    label: 'Brasil',
    value: '+55',
    code: 'BR',
  },
  {
    name_en: 'British Indian Ocean Territory',
    label: 'Territorio Británico del Océano Índico',
    value: '+246',
    code: 'IO',
  },
  {
    name_en: 'Brunei Darussalam',
    label: 'Brunei',
    value: '+673',
    code: 'BN',
  },
  {
    name_en: 'Bulgaria',
    label: 'Bulgaria',
    value: '+359',
    code: 'BG',
  },
  {
    name_en: 'Burkina Faso',
    label: 'Burkina Faso',
    value: '+226',
    code: 'BF',
  },
  {
    name_en: 'Burundi',
    label: 'Burundi',
    value: '+257',
    code: 'BI',
  },
  {
    name_en: 'Cambodia',
    label: 'Camboya',
    value: '+855',
    code: 'KH',
  },
  {
    name_en: 'Cameroon',
    label: 'Camerún',
    value: '+237',
    code: 'CM',
  },
  {
    name_en: 'Canada',
    label: 'Canadá',
    value: '+1',
    code: 'CA',
  },
  {
    name_en: 'Cape Verde',
    label: 'Cabo Verde',
    value: '+238',
    code: 'CV',
  },
  {
    name_en: 'Cayman Islands',
    label: 'Islas Caimán',
    value: '+ 345',
    code: 'KY',
  },
  {
    name_en: 'Central African Republic',
    label: 'República Centroafricana',
    value: '+236',
    code: 'CF',
  },
  {
    name_en: 'Chad',
    label: 'Chad',
    value: '+235',
    code: 'TD',
  },
  {
    name_en: 'Chile',
    label: 'Chile',
    value: '+56',
    code: 'CL',
  },
  {
    name_en: 'China',
    label: 'China',
    value: '+86',
    code: 'CN',
  },
  {
    name_en: 'Christmas Island',
    label: 'Isla de Navidad',
    value: '+61',
    code: 'CX',
  },
  {
    name_en: 'Cocos (Keeling) Islands',
    label: 'Islas Cocos',
    value: '+61',
    code: 'CC',
  },
  {
    name_en: 'Colombia',
    label: 'Colombia',
    value: '+57',
    code: 'CO',
  },
  {
    name_en: 'Comoros',
    label: 'Comoras',
    value: '+269',
    code: 'KM',
  },
  {
    name_en: 'Congo',
    label: 'Congo',
    value: '+242',
    code: 'CG',
  },
  {
    name_en: 'Congo, The Democratic Republic of the',
    label: 'República Democrática del Congo',
    value: '+243',
    code: 'CD',
  },
  {
    name_en: 'Cook Islands',
    label: 'Islas Cook',
    value: '+682',
    code: 'CK',
  },
  {
    name_en: 'Costa Rica',
    label: 'Costa Rica',
    value: '+506',
    code: 'CR',
  },
  {
    name_en: "Cote d'Ivoire",
    label: 'Costa de Marfil',
    value: '+225',
    code: 'CI',
  },
  {
    name_en: 'Croatia',
    label: 'Croacia',
    value: '+385',
    code: 'HR',
  },
  {
    name_en: 'Cuba',
    label: 'Cuba',
    value: '+53',
    code: 'CU',
  },
  {
    name_en: 'Cyprus',
    label: 'Chipre',
    value: '+537',
    code: 'CY',
  },
  {
    name_en: 'Czechia',
    label: 'Chequia',
    value: '+420',
    code: 'CZ',
  },
  {
    name_en: 'Denmark',
    label: 'Dinamarca',
    value: '+45',
    code: 'DK',
  },
  {
    name_en: 'Djibouti',
    label: 'Yibuti',
    value: '+253',
    code: 'DJ',
  },
  {
    name_en: 'Dominica',
    label: 'Dominica',
    value: '+1767',
    code: 'DM',
  },
  {
    name_en: 'Dominican Republic',
    label: 'República Dominicana',
    value: '+1849',
    code: 'DO',
  },
  {
    name_en: 'Ecuador',
    label: 'Ecuador',
    value: '+593',
    code: 'EC',
  },
  {
    name_en: 'Egypt',
    label: 'Egipto',
    value: '+20',
    code: 'EG',
  },
  {
    name_en: 'El Salvador',
    label: 'El Salvador',
    value: '+503',
    code: 'SV',
  },
  {
    name_en: 'Equatorial Guinea',
    label: 'Guinea Ecuatorial',
    value: '+240',
    code: 'GQ',
  },
  {
    name_en: 'Eritrea',
    label: 'Eritrea',
    value: '+291',
    code: 'ER',
  },
  {
    name_en: 'Estonia',
    label: 'Estonia',
    value: '+372',
    code: 'EE',
  },
  {
    name_en: 'Ethiopia',
    label: 'Etiopía',
    value: '+251',
    code: 'ET',
  },
  {
    name_en: 'Falkland Islands (Malvinas)',
    label: 'Islas Malvinas',
    value: '+500',
    code: 'FK',
  },
  {
    name_en: 'Faroe Islands',
    label: 'Islas Feroe',
    value: '+298',
    code: 'FO',
  },
  {
    name_en: 'Fiji',
    label: 'Fiyi',
    value: '+679',
    code: 'FJ',
  },
  {
    name_en: 'Finland',
    label: 'Finlandia',
    value: '+358',
    code: 'FI',
  },
  {
    name_en: 'France',
    label: 'Francia',
    value: '+33',
    code: 'FR',
  },
  {
    name_en: 'French Guiana',
    label: 'Guayana Francesa',
    value: '+594',
    code: 'GF',
  },
  {
    name_en: 'French Polynesia',
    label: 'Polinesia Francesa',
    value: '+689',
    code: 'PF',
  },
  {
    name_en: 'Gabon',
    label: 'Gabón',
    value: '+241',
    code: 'GA',
  },
  {
    name_en: 'Gambia',
    label: 'Gambia',
    value: '+220',
    code: 'GM',
  },
  {
    name_en: 'Georgia',
    label: 'Georgia',
    value: '+995',
    code: 'GE',
  },
  {
    name_en: 'Germany',
    label: 'Alemania',
    value: '+49',
    code: 'DE',
  },
  {
    name_en: 'Ghana',
    label: 'Ghana',
    value: '+233',
    code: 'GH',
  },
  {
    name_en: 'Gibraltar',
    label: 'Gibraltar',
    value: '+350',
    code: 'GI',
  },
  {
    name_en: 'Greece',
    label: 'Grecia',
    value: '+30',
    code: 'GR',
  },
  {
    name_en: 'Greenland',
    label: 'Groenlandia',
    value: '+299',
    code: 'GL',
  },
  {
    name_en: 'Grenada',
    label: 'Granada',
    value: '+1473',
    code: 'GD',
  },
  {
    name_en: 'Guadeloupe',
    label: 'Guadalupe',
    value: '+590',
    code: 'GP',
  },
  {
    name_en: 'Guam',
    label: 'Guam',
    value: '+1671',
    code: 'GU',
  },
  {
    name_en: 'Guatemala',
    label: 'Guatemala',
    value: '+502',
    code: 'GT',
  },
  {
    name_en: 'Guernsey',
    label: 'Guernsey',
    value: '+44',
    code: 'GG',
  },
  {
    name_en: 'Guinea',
    label: 'Guinea',
    value: '+224',
    code: 'GN',
  },
  {
    name_en: 'Guinea-Bissau',
    label: 'Guinea-Bisau',
    value: '+245',
    code: 'GW',
  },
  {
    name_en: 'Guyana',
    label: 'Guyana',
    value: '+595',
    code: 'GY',
  },
  {
    name_en: 'Haiti',
    label: 'Haití',
    value: '+509',
    code: 'HT',
  },
  {
    name_en: 'Holy See (Vatican City State)',
    label: 'Ciudad del Vaticano',
    value: '+379',
    code: 'VA',
  },
  {
    name_en: 'Honduras',
    label: 'Honduras',
    value: '+504',
    code: 'HN',
  },
  {
    name_en: 'Hong Kong',
    label: 'Hong Kong',
    value: '+852',
    code: 'HK',
  },
  {
    name_en: 'Hungary',
    label: 'Hungría',
    value: '+36',
    code: 'HU',
  },
  {
    name_en: 'Iceland',
    label: 'Islandia',
    value: '+354',
    code: 'IS',
  },
  {
    name_en: 'India',
    label: 'India',
    value: '+91',
    code: 'IN',
  },
  {
    name_en: 'Indonesia',
    label: 'Indonesia',
    value: '+62',
    code: 'ID',
  },
  {
    name_en: 'Iran, Islamic Republic of',
    label: 'Irán',
    value: '+98',
    code: 'IR',
  },
  {
    name_en: 'Iraq',
    label: 'Iraq',
    value: '+964',
    code: 'IQ',
  },
  {
    name_en: 'Ireland',
    label: 'Irlanda',
    value: '+353',
    code: 'IE',
  },
  {
    name_en: 'Isle of Man',
    label: 'Isla de Man',
    value: '+44',
    code: 'IM',
  },
  {
    name_en: 'Israel',
    label: 'Israel',
    value: '+972',
    code: 'IL',
  },
  {
    name_en: 'Italy',
    label: 'Italia',
    value: '+39',
    code: 'IT',
  },
  {
    name_en: 'Jamaica',
    label: 'Jamaica',
    value: '+1876',
    code: 'JM',
  },
  {
    name_en: 'Japan',
    label: 'Japón',
    value: '+81',
    code: 'JP',
  },
  {
    name_en: 'Jersey',
    label: 'Jersey',
    value: '+44',
    code: 'JE',
  },
  {
    name_en: 'Jordan',
    label: 'Jordania',
    value: '+962',
    code: 'JO',
  },
  {
    name_en: 'Kazakhstan',
    label: 'Kazajistán',
    value: '+7',
    code: 'KZ',
  },
  {
    name_en: 'Kenya',
    label: 'Kenia',
    value: '+254',
    code: 'KE',
  },
  {
    name_en: 'Kiribati',
    label: 'Kiribati',
    value: '+686',
    code: 'KI',
  },
  {
    name_en: "Korea, Democratic People's Republic of",
    label: 'Corea del Norte',
    value: '+850',
    code: 'KP',
  },
  {
    name_en: 'Korea, Republic of',
    label: 'Corea del Sur',
    value: '+82',
    code: 'KR',
  },
  {
    name_en: 'Kosovo',
    label: 'Kosovo',
    value: '+383',
    code: 'XK',
  },
  {
    name_en: 'Kuwait',
    label: 'Kuwait',
    value: '+965',
    code: 'KW',
  },
  {
    name_en: 'Kyrgyzstan',
    label: 'Kirguistán',
    value: '+996',
    code: 'KG',
  },
  {
    name_en: "Lao People's Democratic Republic",
    label: 'Laos',
    value: '+856',
    code: 'LA',
  },
  {
    name_en: 'Latvia',
    label: 'Letonia',
    value: '+371',
    code: 'LV',
  },
  {
    name_en: 'Lebanon',
    label: 'Líbano',
    value: '+961',
    code: 'LB',
  },
  {
    name_en: 'Lesotho',
    label: 'Lesoto',
    value: '+266',
    code: 'LS',
  },
  {
    name_en: 'Liberia',
    label: 'Liberia',
    value: '+231',
    code: 'LR',
  },
  {
    name_en: 'Libyan Arab Jamahiriya',
    label: 'Libia',
    value: '+218',
    code: 'LY',
  },
  {
    name_en: 'Liechtenstein',
    label: 'Liechtenstein',
    value: '+423',
    code: 'LI',
  },
  {
    name_en: 'Lithuania',
    label: 'Lituania',
    value: '+370',
    code: 'LT',
  },
  {
    name_en: 'Luxembourg',
    label: 'Luxemburgo',
    value: '+352',
    code: 'LU',
  },
  {
    name_en: 'Macao',
    label: 'Macao',
    value: '+853',
    code: 'MO',
  },
  {
    name_en: 'Macedonia, The Former Yugoslav Republic of',
    label: 'República de Macedonia',
    value: '+389',
    code: 'MK',
  },
  {
    name_en: 'Madagascar',
    label: 'Madagascar',
    value: '+261',
    code: 'MG',
  },
  {
    name_en: 'Malawi',
    label: 'Malaui',
    value: '+265',
    code: 'MW',
  },
  {
    name_en: 'Malaysia',
    label: 'Malasia',
    value: '+60',
    code: 'MY',
  },
  {
    name_en: 'Maldives',
    label: 'Maldivas',
    value: '+960',
    code: 'MV',
  },
  {
    name_en: 'Mali',
    label: 'Malí',
    value: '+223',
    code: 'ML',
  },
  {
    name_en: 'Malta',
    label: 'Malta',
    value: '+356',
    code: 'MT',
  },
  {
    name_en: 'Marshall Islands',
    label: 'Islas Marshall',
    value: '+692',
    code: 'MH',
  },
  {
    name_en: 'Martinique',
    label: 'Martinica',
    value: '+596',
    code: 'MQ',
  },
  {
    name_en: 'Mauritania',
    label: 'Mauritania',
    value: '+222',
    code: 'MR',
  },
  {
    name_en: 'Mauritius',
    label: 'Mauricio',
    value: '+230',
    code: 'MU',
  },
  {
    name_en: 'Mayotte',
    label: 'Mayotte',
    value: '+262',
    code: 'YT',
  },
  {
    name_en: 'Mexico',
    label: 'México',
    value: '+52',
    code: 'MX',
  },
  {
    name_en: 'Micronesia, Federated States of',
    label: 'Estados Federados de Micronesia',
    value: '+691',
    code: 'FM',
  },
  {
    name_en: 'Moldova, Republic of',
    label: 'Moldavia',
    value: '+373',
    code: 'MD',
  },
  {
    name_en: 'Monaco',
    label: 'Monaco',
    value: '+377',
    code: 'MC',
  },
  {
    name_en: 'Mongolia',
    label: 'Mongolia',
    value: '+976',
    code: 'MN',
  },
  {
    name_en: 'Montenegro',
    label: 'Montenegro',
    value: '+382',
    code: 'ME',
  },
  {
    name_en: 'Montserrat',
    label: 'Montserrat',
    value: '+1664',
    code: 'MS',
  },
  {
    name_en: 'Morocco',
    label: 'Marruecos',
    value: '+212',
    code: 'MA',
  },
  {
    name_en: 'Mozambique',
    label: 'Mozambique',
    value: '+258',
    code: 'MZ',
  },
  {
    name_en: 'Myanmar',
    label: 'Birmania',
    value: '+95',
    code: 'MM',
  },
  {
    name_en: 'Namibia',
    label: 'Namibia',
    value: '+264',
    code: 'NA',
  },
  {
    name_en: 'Nauru',
    label: 'Nauru',
    value: '+674',
    code: 'NR',
  },
  {
    name_en: 'Nepal',
    label: 'Nepal',
    value: '+977',
    code: 'NP',
  },
  {
    name_en: 'Netherlands',
    label: 'Holanda',
    value: '+31',
    code: 'NL',
  },
  {
    name_en: 'Netherlands Antilles',
    label: 'Antillas Holandesas',
    value: '+599',
    code: 'AN',
  },
  {
    name_en: 'New Caledonia',
    label: 'Nueva Caledonia',
    value: '+687',
    code: 'NC',
  },
  {
    name_en: 'New Zealand',
    label: 'Nueva Zelanda',
    value: '+64',
    code: 'NZ',
  },
  {
    name_en: 'Nicaragua',
    label: 'Nicaragua',
    value: '+505',
    code: 'NI',
  },
  {
    name_en: 'Niger',
    label: 'Niger',
    value: '+227',
    code: 'NE',
  },
  {
    name_en: 'Nigeria',
    label: 'Nigeria',
    value: '+234',
    code: 'NG',
  },
  {
    name_en: 'Niue',
    label: 'Niue',
    value: '+683',
    code: 'NU',
  },
  {
    name_en: 'NorfolkIsland',
    label: 'IslaNorfolk',
    value: '+672',
    code: 'NF',
  },
  {
    name_en: 'NorthernMarianaIslands',
    label: 'IslasMarianasdelNorte',
    value: '+1670',
    code: 'MP',
  },
  {
    name_en: 'Norway',
    label: 'Noruega',
    value: '+47',
    code: 'NO',
  },
  {
    name_en: 'Oman',
    label: 'Omán',
    value: '+968',
    code: 'OM',
  },
  {
    name_en: 'Pakistan',
    label: 'Pakistán',
    value: '+92',
    code: 'PK',
  },
  {
    name_en: 'Palau',
    label: 'Palaos',
    value: '+680',
    code: 'PW',
  },
  {
    name_en: 'Panama',
    label: 'Panamá',
    value: '+507',
    code: 'PA',
  },
  {
    name_en: 'Papua New Guinea',
    label: 'Papúa Nueva Guinea',
    value: '+675',
    code: 'PG',
  },
  {
    name_en: 'Paraguay',
    label: 'Paraguay',
    value: '+595',
    code: 'PY',
  },
  {
    name_en: 'Peru',
    label: 'Perú',
    value: '+51',
    code: 'PE',
  },
  {
    name_en: 'Philippines',
    label: 'Filipinas',
    value: '+63',
    code: 'PH',
  },
  {
    name_en: 'Pitcairn',
    label: 'Islas Pitcairn',
    value: '+872',
    code: 'PN',
  },
  {
    name_en: 'Poland',
    label: 'Polonia',
    value: '+48',
    code: 'PL',
  },
  {
    name_en: 'Portugal',
    label: 'Portugal',
    value: '+351',
    code: 'PT',
  },
  {
    name_en: 'Puerto Rico',
    label: 'Puerto Rico',
    value: '+1939',
    code: 'PR',
  },
  {
    name_en: 'Qatar',
    label: 'Qatar',
    value: '+974',
    code: 'QA',
  },
  {
    name_en: 'Romania',
    label: 'Rumania',
    value: '+40',
    code: 'RO',
  },
  {
    name_en: 'Russia',
    label: 'Rusia',
    value: '+7',
    code: 'RU',
  },
  {
    name_en: 'Rwanda',
    label: 'Ruanda',
    value: '+250',
    code: 'RW',
  },
  {
    name_en: 'Réunion',
    label: 'Reunion',
    value: '+262',
    code: 'RE',
  },
  {
    name_en: 'Saint Barthélemy',
    label: 'San Bartolome',
    value: '+590',
    code: 'BL',
  },
  {
    name_en: 'Saint Helena, Ascension and Tristan Da Cunha',
    label: 'Santa Elena, Ascensión y Tristán de Acuña',
    value: '+290',
    code: 'SH',
  },
  {
    name_en: 'Saint Kitts and Nevis',
    label: 'San Cristóbal y Nieves',
    value: '+1869',
    code: 'KN',
  },
  {
    name_en: 'Saint Lucia',
    label: 'Santa Lucía',
    value: '+1758',
    code: 'LC',
  },
  {
    name_en: 'Saint Martin',
    label: 'Isla de San Martín',
    value: '+590',
    code: 'MF',
  },
  {
    name_en: 'Saint Pierre and Miquelon',
    label: 'San Pedro y Miquelon',
    value: '+508',
    code: 'PM',
  },
  {
    name_en: 'Saint Vincent and the Grenadines',
    label: 'San Vicente y las Granadinas',
    value: '+1784',
    code: 'VC',
  },
  {
    name_en: 'Samoa',
    label: 'Samoa',
    value: '+685',
    code: 'WS',
  },
  {
    name_en: 'San Marino',
    label: 'San Marino',
    value: '+378',
    code: 'SM',
  },
  {
    name_en: 'Sao Tome and Principe',
    label: ' Santo Tomé y Príncipe',
    value: '+239',
    code: 'ST',
  },
  {
    name_en: 'Saudi Arabia',
    label: 'Arabia Saudita',
    value: '+966',
    code: 'SA',
  },
  {
    name_en: 'Senegal',
    label: 'Senegal',
    value: '+221',
    code: 'SN',
  },
  {
    name_en: 'Serbia',
    label: 'Serbia',
    value: '+381',
    code: 'RS',
  },
  {
    name_en: 'Seychelles',
    label: 'Seychelles',
    value: '+248',
    code: 'SC',
  },
  {
    name_en: 'Sierra Leone',
    label: 'Sierra Leona',
    value: '+232',
    code: 'SL',
  },
  {
    name_en: 'Singapore',
    label: 'Singapur',
    value: '+65',
    code: 'SG',
  },
  {
    name_en: 'Slovakia',
    label: 'Eslovaquia',
    value: '+421',
    code: 'SK',
  },
  {
    name_en: 'Slovenia',
    label: 'Eslovenia',
    value: '+386',
    code: 'SI',
  },
  {
    name_en: 'Solomon Islands',
    label: 'Islas Salomón',
    value: '+677',
    code: 'SB',
  },
  {
    name_en: 'Somalia',
    label: 'Somalia',
    value: '+252',
    code: 'SO',
  },
  {
    name_en: 'South Africa',
    label: 'Sudáfrica',
    value: '+27',
    code: 'ZA',
  },
  {
    name_en: 'South Sudan',
    label: 'Sudán del Sur',
    value: '+211',
    code: 'SS',
  },
  {
    name_en: 'Spain',
    label: 'España',
    value: '+34',
    code: 'ES',
  },
  {
    name_en: 'Sri Lanka',
    label: 'Sri Lanka',
    value: '+94',
    code: 'LK',
  },
  {
    name_en: 'State of Palestine',
    label: 'Estado de Palestina',
    value: '+970',
    code: 'PS',
  },
  {
    name_en: 'Sudan',
    label: 'Sudán',
    value: '+249',
    code: 'SD',
  },
  {
    name_en: 'Suriname',
    label: 'Surinam',
    value: '+597',
    code: 'SR',
  },
  {
    name_en: 'Svalbard and Jan Mayen',
    label: 'Svalbard y Jan Mayen',
    value: '+47',
    code: 'SJ',
  },
  {
    name_en: 'Swaziland',
    label: 'Suazilandia',
    value: '+268',
    code: 'SZ',
  },
  {
    name_en: 'Sweden',
    label: 'Suecia',
    value: '+46',
    code: 'SE',
  },
  {
    name_en: 'Switzerland',
    label: 'Suiza',
    value: '+41',
    code: 'CH',
  },
  {
    name_en: 'Syrian Arab Republic',
    label: 'Siria',
    value: '+963',
    code: 'SY',
  },
  {
    name_en: 'Taiwan, Province of China',
    label: 'Taiwán',
    value: '+886',
    code: 'TW',
  },
  {
    name_en: 'Tayikistan',
    label: 'Tayikistán',
    value: '+992',
    code: 'TJ',
  },
  {
    name_en: 'Tanzania, United Republic of',
    label: 'Tanzania',
    value: '+255',
    code: 'TZ',
  },
  {
    name_en: 'Thailand',
    label: 'Tailandia',
    value: '+66',
    code: 'TH',
  },
  {
    name_en: 'Timor-Leste',
    label: 'Timor Oriental',
    value: '+670',
    code: 'TL',
  },
  {
    name_en: 'Togo',
    label: 'Togo',
    value: '+228',
    code: 'TG',
  },
  {
    name_en: 'Tokelau',
    label: 'Tokelau',
    value: '+690',
    code: 'TK',
  },
  {
    name_en: 'Tonga',
    label: 'Tonga',
    value: '+676',
    code: 'TO',
  },
  {
    name_en: 'Trinidad and Tobago',
    label: 'Trinidad y Tobago',
    value: '+1868',
    code: 'TT',
  },
  {
    name_en: 'Tunisia',
    label: 'Túnez',
    value: '+216',
    code: 'TN',
  },
  {
    name_en: 'Turkey',
    label: 'Turquía',
    value: '+90',
    code: 'TR',
  },
  {
    name_en: 'Turkmenistan',
    label: 'Turkmenistán',
    value: '+993',
    code: 'TM',
  },
  {
    name_en: 'Turks and Caicos Islands',
    label: 'Islas Turcas y Caicos',
    value: '+1649',
    code: 'TC',
  },
  {
    name_en: 'Tuvalu',
    label: 'Tuvalu',
    value: '+688',
    code: 'TV',
  },
  {
    name_en: 'Uganda',
    label: 'Uganda',
    value: '+256',
    code: 'UG',
  },
  {
    name_en: 'Ukraine',
    label: 'Ucrania',
    value: '+380',
    code: 'UA',
  },
  {
    name_en: 'United Arab Emirates',
    label: 'Emiratos Árabes Unidos',
    value: '+971',
    code: 'AE',
  },
  {
    name_en: 'United Kingdom',
    label: 'Reino Unido',
    value: '+44',
    code: 'GB',
  },
  {
    name_en: 'United States',
    label: 'Estados Unidos',
    value: '+1',
    code: 'US',
  },
  {
    name_en: 'Uruguay',
    label: 'Uruguay',
    value: '+598',
    code: 'UY',
  },
  {
    name_en: 'Uzbekistan',
    label: 'Uzbekistán',
    value: '+998',
    code: 'UZ',
  },
  {
    name_en: 'Vanuatu',
    label: 'Vanuatu',
    value: '+678',
    code: 'VU',
  },
  {
    name_en: 'Venezuela, Bolivarian Republic of',
    label: 'Venezuela',
    value: '+58',
    code: 'VE',
  },
  {
    name_en: 'Vietnam',
    label: 'Vietnam',
    value: '+84',
    code: 'VN',
  },
  {
    name_en: 'Virgin Islands, British',
    label: 'Islas Vírgenes Británicas',
    value: '+1284',
    code: 'VG',
  },
  {
    name_en: 'Virgin Islands, U.S.',
    label: 'Islas Vírgenes de los Estados Unidos',
    value: '+1340',
    code: 'VI',
  },
  {
    name_en: 'Wallis and Futuna',
    label: 'Wallis y Futuna',
    value: '+681',
    code: 'WF',
  },
  {
    name_en: 'Yemen',
    label: 'Yemen',
    value: '+967',
    code: 'YE',
  },
  {
    name_en: 'Zambia',
    label: 'Zambia',
    value: '+260',
    code: 'ZM',
  },
  {
    name_en: 'Zimbabwe',
    label: 'Zimbabue',
    value: '+263',
    code: 'ZW',
  },
  {
    name_en: 'Åland Islands',
    label: 'Åland',
    value: '+358',
    code: 'AX',
  },
];

export const host_list = [
  {
    host_id: 'KthHMroFQK24I97YoqxBZw',
    host_name: 'host1@evius.co',
  },
  {
    host_id: '15DKHS_6TqWIFpwShasM4w',
    host_name: 'host2@evius.co',
  },
  {
    host_id: 'FIRVnSoZR7WMDajgtzf5Uw',
    host_name: 'host3@evius.co',
  },
  {
    host_id: 'YaXq_TW2f791cVpP8og',
    host_name: 'host4@evius.co',
  },
  {
    host_id: 'mSkbi8PmSSqQEWsm6FQiAA',
    host_name: 'host5@evius.co',
  },
];

export const activitiesCode = [
  '6172f2b78794bf51952c74f3',
  '6172f2548794bf51952c74f2',
  '61732b4cfbe4ff412315beb6',
  '6172f380c5c23b745b6a3905',
];
export const cityValid = ['medellin', 'Medellin', 'medellín', 'Medellín'];
export const codeActivity = ['EDC21CF110', 'EDC21IPH', 'EDC21MID7', 'EDC21CV48', '1EDC21OFF', '1EDC50OF21'];

export const femaleicons = [
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Ffemale%2F002-woman.png?alt=media&token=e01354bd-9119-4a91-983b-321424a7fe0c',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Ffemale%2F004-woman-1.png?alt=media&token=a05a8271-bb63-4395-942e-7e4be3c0e04a',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Ffemale%2F006-woman-2.png?alt=media&token=d3e9438e-f75f-4157-924d-f2d97773c7cf',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Ffemale%2F008-woman-3.png?alt=media&token=e442e1f9-d54d-43ef-a75c-99cd563ec558',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Ffemale%2F010-woman-4.png?alt=media&token=53da4377-82ab-48cb-9685-9014cbc9d542',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Ffemale%2F012-woman-5.png?alt=media&token=c985e1da-253d-44f0-846e-5d5cfc00c9f8',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Ffemale%2F014-woman-6.png?alt=media&token=704fc86a-231c-4679-b5e7-4c4835058759',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Ffemale%2F017-woman-7.png?alt=media&token=669b899b-64bf-43a6-80db-f07aeec6fea8',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Ffemale%2F018-woman-8.png?alt=media&token=e4e09fae-ab25-4c96-94e9-e36bbfd2561c',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Ffemale%2F019-woman-9.png?alt=media&token=7f924377-5f9c-4722-9b7f-fd6895fceb26',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Ffemale%2F021-woman-10.png?alt=media&token=35b54acd-bc3b-4d1c-86c2-5b6a6d0f4c8e',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Ffemale%2F025-woman-11.png?alt=media&token=1dff23b2-d058-4d7f-88e3-b5672a80b232',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Ffemale%2F026-woman-12.png?alt=media&token=fe88e5de-2706-4db5-97a6-8fa75d23bc32',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Ffemale%2F028-woman-13.png?alt=media&token=ca472b16-c552-4753-82d0-23f49428c30e',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Ffemale%2F030-woman-14.png?alt=media&token=0e93df80-ddf3-4c52-b1fb-ca1d368be6b8',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Ffemale%2F032-woman-15.png?alt=media&token=c52a275c-cbaf-49b3-a98b-f40ac3cac5c7',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Ffemale%2F034-woman-16.png?alt=media&token=2f6255e7-41ae-4e9e-9180-8b2ebf2a0184',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Ffemale%2F036-woman-17.png?alt=media&token=da88656f-328e-496b-a949-bacffba6fcae',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Ffemale%2F037-woman-18.png?alt=media&token=5dd38018-6489-4d15-babe-5aac3c822dad',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Ffemale%2F039-woman-19.png?alt=media&token=b4966d3e-c180-4cd3-8a60-c036c3b64c84',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Ffemale%2F045-woman-20.png?alt=media&token=381b215c-f83d-40dd-99c4-e8c552dc6382',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Ffemale%2F046-woman-21.png?alt=media&token=a437fa30-1536-40be-8cba-9617fbaf6d2c',
];

export const maleIcons = [
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Fmale%2F001-man.png?alt=media&token=4471955c-11bc-429a-af49-69db9450a8b7',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Fmale%2F003-man-1.png?alt=media&token=e2d1ddae-7fde-4d4e-a34d-6336e4ea93b9',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Fmale%2F005-man-2.png?alt=media&token=46aabc41-b974-4516-9106-b3a0e7a0fba5',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Fmale%2F007-man-3.png?alt=media&token=9c7c3854-103c-4445-97ea-1dd0ef395df4',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Fmale%2F009-man-4.png?alt=media&token=fd4ed285-3c2f-407f-96a3-977ef3b1adce',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Fmale%2F011-man-5.png?alt=media&token=40f7c32c-8eb9-4c3c-9ed9-540fec6958d9',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Fmale%2F013-man-6.png?alt=media&token=67906175-c1e3-411f-afec-d04ed825d762',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Fmale%2F015-man-7.png?alt=media&token=2a0a62f0-0610-41d7-bcd0-3a6a425daac1',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Fmale%2F016-man-8.png?alt=media&token=213c2a62-66ad-4373-8f10-50624f4081ce',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Fmale%2F020-man-9.png?alt=media&token=24c61645-c2e0-42f1-9fe0-b8cda9800bfc',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Fmale%2F022-man-10.png?alt=media&token=ee335ce1-1e6b-46d0-bc15-771c4cf5ad19',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Fmale%2F023-man-11.png?alt=media&token=658ccc03-ebb6-4efd-9385-869e3a2afcc6',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Fmale%2F024-man-12.png?alt=media&token=c2f36196-2438-43f3-83f0-89506dd66df4',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Fmale%2F027-man-13.png?alt=media&token=62fcff06-9c0e-4ead-98c1-c3e1a01cd291',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Fmale%2F029-man-14.png?alt=media&token=4aee587a-d977-4376-a732-74901d4082a0',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Fmale%2F031-man-15.png?alt=media&token=faf0c5be-ab17-42c3-80a4-9bec545c84ff',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Fmale%2F033-man-16.png?alt=media&token=fef4785a-d48d-440a-8203-c2d27c7fc3bd',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Fmale%2F035-man-17.png?alt=media&token=394d59d9-55f9-45f5-9648-f3d0ec98c78a',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Fmale%2F038-man-18.png?alt=media&token=a26e35c6-747e-4d97-a7ea-582252db35b6',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Fmale%2F040-man-19.png?alt=media&token=56d36966-d5bc-4b07-944c-d23965af9813',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Fmale%2F041-man-20.png?alt=media&token=2d13efec-6670-4933-ac10-f020fa00bc91',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Fmale%2F042-man-21.png?alt=media&token=868491e3-37e3-4e84-8ba1-fed260f845f3',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Fmale%2F043-man-22.png?alt=media&token=bfb07e21-cf2f-4724-84ef-c3397c87530c',
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/genderschats%2Fmale%2F044-man-23.png?alt=media&token=44016456-1872-468a-8290-eb64bbb9aa07',
];
export const configEventsTemplate = {
  BackgroundImage:
    'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/template%2FBackgroud.jpg?alt=media&token=cae37ed9-9817-4300-87e9-e9cac7106b05',
  banner_footer:
    'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/template%2Ffooter.png?alt=media&token=363b3aab-b149-43f1-9173-622d0b8128f9',
  event_image:
    'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/template%2FLogoEvius.jpeg?alt=media&token=8633227f-74d2-4798-ae48-3f1b74d38d9c',
  banner_image:
    'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/template%2Fbanner.jpg?alt=media&token=8642d0ed-61e2-4fed-97fa-1cdd5687aeaf',
};

export const imageforDefaultProfile = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
