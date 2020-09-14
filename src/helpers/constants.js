import React from "react";

export const ApiUrl = process.env.REACT_APP_API_URL;
//export const ApiUrl  = 'https://dev.mocionsoft.com/evius/eviusapilaravel/public';
export const AuthUrl = process.env.REACT_APP_AUTH_URL;
export const BaseUrl = process.env.REACT_APP_BASE_URL;
export const EVIUS_GOOGLE_MAPS_KEY = process.env.EVIUS_GOOGLE_MAPS_KEY || "AIzaSyCmcIJ4xnytwh5ToGhN1Pl56RiualarBqk";
export const ApiEviusZoomServer = process.env.REACT_APP_API_EVIUS_ZOOM_SERVER;
export const ApiGoogleDocuments = process.env.REACT_APP_API_GOOGLE_API_DOCUMENTS;

export const parseUrl = (url) => {
  try {
    let temporal = {};
    url
      .split("?")[1]
      .split("&")
      .map((obj) => {
        return (temporal[obj.split("=")[0]] = obj.split("=")[1]);
      });
    return temporal;
  } catch (error) {
    return {};
  }
};
export const parseCookies = (cookies) => {
  let temporal = [];
  cookies.split("&").map((obj) => {
    return temporal.push({ [obj.split("=")[0]]: obj.split("=")[1] });
  });
  return temporal;
};
export const networks = [
  { name: "Facebook", path: "facebook", icon: <i className="fab fa-facebook"></i> },
  { name: "Twitter", path: "twitter", icon: <i className="fab fa-twitter"></i> },
  { name: "Instagram", path: "instagram", icon: <i className="fab fa-instagram"></i> },
  { name: "LinkedIn", path: "linkedIn", icon: <i className="fab fa-linkedin"></i> },
];
export const rolPermissions = {
  admin_ticket: {
    _id: "5c09261df33bd415e22dcdb2",
    name: "Tiquetes",
  },
  admin_staff: {
    _id: "5c192400f33bd41b9070cb34",
    name: "Asignación de roles para el evento",
  },
  admin_invitations: {
    _id: "5c192410f33bd41b9070cb36",
    name: "Administrar invitaciones",
  },
  admin_badge: {
    _id: "5c192450f33bd450a6022e36",
    name: "Modificación de la escarapela",
  },
  checkin: {
    _id: "5c19242ff33bd46c102ec975",
    name: "Realización del checking",
  },
  add_attendees: {
    _id: "5c192408f33bd41b9070cb35",
    name: "Agregar asistente",
  },
  update_attendees: {
    _id: "5c19243cf33bd450a6022e33",
    name: "Actualización de datos del asistente",
  },
  delete_attendees: {
    _id: "5c192443f33bd450a6022e34",
    name: "Eliminar asistente",
  },
  print_attendees: {
    _id: "5c19244af33bd450a6022e35",
    name: "Impresión de la escarapela del asistente",
  },
  history_invitations: {
    _id: "5c192428f33bd46c102ec974",
    name: "Historial de las invitaciones enviadas",
  },
  metrics: {
    _id: "5c092624f33bd415e22dcdb3",
    name: "Metricas del evento",
  },
};
export const typeInputs = [
  { value: "text", label: "Texto" },
  { value: "country", label: "Pais "},
  { value: "city", label: "Ciudad "},
  { value: "longtext", label: "Texto Largo" },
  { value: "email", label: "Correo" },
  { value: "number", label: "Numérico" },
  { value: "list", label: "Lista Opciones" },
  { value: "multiplelist", label: "Selección multiple" },
  { value: "date", label: "Fecha (DD/MM/YYYY)" },
  { value: "boolean", label: "Si/No" },
  { value: "file", label: "Archivo" },
  { value: "complex", label: "JSON" },
  { value: "tituloseccion", label: "Titulo para indicar campos relacionados" },
];
export const toolbarEditor = {
  toolbar: [
    [{ font: [] }],
    [{ header: [0, 1, 2, 3] }],
    [{ size: [] }],
    [{ align: [] }],
    [{ syntax: true }],    
    [("bold", "italic", "blockquote")],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
  ],
};

export const imageBox =
  '<svg id="Layer_1" style="enable-background:new 0 0 64 64;" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><style type="text/css">\n' +
  "\t.st0{fill:#134563;}\n" +
  '</style><g><g id="Icon-Image" transform="translate(278.000000, 232.000000)"><path class="st0" d="M-226.2-181.6h-39.5c-2.3,0-4.2-1.9-4.2-4.2v-28.2c0-2.3,1.9-4.2,4.2-4.2h39.5     c2.3,0,4.2,1.9,4.2,4.2v28.2C-222-183.5-223.9-181.6-226.2-181.6L-226.2-181.6z M-265.8-215.5c-0.8,0-1.4,0.6-1.4,1.4v28.2     c0,0.8,0.6,1.4,1.4,1.4h39.5c0.8,0,1.4-0.6,1.4-1.4v-28.2c0-0.8-0.6-1.4-1.4-1.4H-265.8L-265.8-215.5z" id="Fill-12"/><path class="st0" d="M-238.9-201.5c-3.1,0-5.5-2.5-5.5-5.5s2.5-5.5,5.5-5.5s5.5,2.5,5.5,5.5     S-235.9-201.5-238.9-201.5L-238.9-201.5z M-238.9-210c-1.6,0-2.9,1.3-2.9,2.9c0,1.6,1.3,2.9,2.9,2.9c1.6,0,2.9-1.3,2.9-2.9     C-236-208.7-237.3-210-238.9-210L-238.9-210z" id="Fill-13"/><polyline class="st0" id="Fill-14" points="-231.4,-182.1 -254.5,-203.8 -267.7,-191.6 -269.5,-193.5 -254.5,-207.4 -229.6,-184      -231.4,-182.1    "/><polyline class="st0" id="Fill-15" points="-224.2,-189.3 -231.9,-195.5 -238.3,-190.2 -240,-192.3 -231.9,-198.9 -222.6,-191.3      -224.2,-189.3    "/></g></g></svg>';

export const icon =
  '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n' +
  '\t viewBox="0 0 1128 193" style="enable-background:new 0 0 1128 193;" xml:space="preserve">\n' +
  "<g>\n" +
  '\t<path style="fill:#50D3C9" d="M318.4,8.6l-68,174.7c-0.8,2.3-2,3.1-4.3,3.1h-4.8c-2.5,0-3.6-0.8-4.3-2.8l-68-175c-0.8-1.8-0.3-3.1,2-3.1h4.8\n' +
  "\t\tc3.8,0,4.8,0.5,5.6,2.8l56.6,146.4c2.3,6.4,4.3,13.8,5.6,17.1h0.8c1.3-3.3,3.1-10.4,5.3-17.1L305.9,8.4c0.8-2.3,2-2.8,5.6-2.8h4.8\n" +
  '\t\tC318.9,5.6,319.2,6.8,318.4,8.6"/>\n' +
  '\t<path style="fill:#50D3C9" d="M396.8,5.6h5.3c2.3,0,3.1,0.8,3.1,3.3v174.2c0,2.5-0.8,3.3-3.1,3.3h-5.3c-2.6,0-3.3-0.8-3.3-3.3V8.9\n' +
  '\t\tC393.5,6.3,394.3,5.6,396.8,5.6"/>\n' +
  '\t<path style="fill:#50D3C9" d="M563.6,179.3c37.2,0,55.3-21.1,55.3-54V8.9c0-2.5,0.8-3.3,3.1-3.3h5.6c2.3,0,3.1,0.8,3.1,3.3v116.4\n' +
  "\t\tc0,39.5-22.1,64.9-67,64.9c-45.1,0-67.2-25.5-67.2-64.9V8.9c0-2.5,0.8-3.3,3.3-3.3h5.3c2.3,0,3.1,0.8,3.1,3.3v116.4\n" +
  '\t\tC508.1,158.1,526.1,179.3,563.6,179.3"/>\n' +
  '\t<path style="fill:#50D3C9" d="M779,2c34.1,0,53.5,12.5,66.7,39.5c1.3,2.3,0.5,3.6-1.5,4.3l-5.1,2.3c-2,0.8-2.8,0.8-4.1-1.5\n' +
  "\t\tc-11.5-22.7-27.5-33.4-56-33.4c-32.9,0-52,14.3-52,38.7c0,30.1,28.3,34.9,57.1,38c31.1,3.6,63.4,8.9,63.4,48.1\n" +
  "\t\tc0,33.1-22.9,52-67.2,52c-35.7,0-56.3-14.3-68.5-44.6c-1-2.6-0.8-3.6,1.8-4.6l4.8-1.8c2.3-0.8,3.1-0.5,4.3,2\n" +
  "\t\tc11,25.7,29,37.7,57.6,37.7c36.7,0,55.5-13.2,55.5-40.2c0-30-26.5-33.9-54.2-37.2c-31.8-3.8-66.5-9.2-66.5-48.6\n" +
  '\t\tC715,21.6,738.7,2,779,2"/>\n' +
  '\t<path style="fill:#50D3C9" d="M108.2,17.8H3.7C3.3,17.8,3,17.4,3,17V5.8C3,5.4,3.3,5,3.7,5h104.4c0.4,0,0.7,0.3,0.7,0.7V17\n' +
  '\t\tC108.9,17.4,108.6,17.8,108.2,17.8"/>\n' +
  '\t<path style="fill:#50D3C9" d="M108.2,102.3H3.7c-0.4,0-0.7-0.3-0.7-0.7V90.3c0-0.4,0.3-0.7,0.7-0.7h104.4c0.4,0,0.7,0.3,0.7,0.7v11.2\n' +
  '\t\tC108.9,101.9,108.6,102.3,108.2,102.3"/>\n' +
  '\t<path style="fill:#50D3C9" d="M108.2,186.8H3.7c-0.4,0-0.7-0.3-0.7-0.7v-11.2c0-0.4,0.3-0.7,0.7-0.7h104.4c0.4,0,0.7,0.3,0.7,0.7V186\n' +
  '\t\tC108.9,186.5,108.6,186.8,108.2,186.8"/>\n' +
  '\t<rect x="3" y="161.3" style="fill:#50D3C9" width="12.7" height="15.4"/>\n' +
  '\t<text transform="matrix(1 0 0 1 871.8398 189.939)"><tspan x="0" y="0" style="fill:#50D3C9;font-family:\'Montserrat\';font-size:122.7092px;letter-spacing:24;">.C</tspan><tspan x="159.4" y="0" style="fill:#50D3C9;font-family:\'Montserrat\';font-size:122.7092px;letter-spacing:24;">O</tspan></text>\n' +
  "</g>\n" +
  "</svg>";
