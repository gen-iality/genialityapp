//Función para generar UUID
import React from 'react';
import Swal from 'sweetalert2';
import moment from 'moment';
import { Actions } from './request';

export function uniqueID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
}
//Función para organizar las opciones de las listas desplegables (Organizado,Tipo,Categoría)
export function fieldsSelect(options, list) {
  if (Array.isArray(options)) return options.map((option) => list.find(({ value }) => value === option));
  else return list.find(({ value }) => value === options);
}

export function handleSelect(data) {
  let list = [];
  data.map((item) => {
    return list.push({ value: item._id, label: item.name, item });
  });
  return list;
}

export function loadImage(src, cb) {
  const i = new Image();
  i.onload = () => {
    let reader = new FileReader();
    reader.readAsDataURL(src);
    reader.onload = () => cb(reader.result);
  };
  i.src = src.preview;
}

export function uploadImage(file) {
  return new Promise((resolve, reject) => {
    let data = new FormData();
    data.append('file', file);
    Actions.post('/api/files/upload', data)
      .then((image) => resolve(image))
      .catch((e) => reject(e));
  });
}

export function fieldNameEmailFirst(array) {
  let fields = [...array];
  const idxName = array.findIndex(({ name }) => name === 'names');
  fields.splice(0, 0, fields.splice(idxName, 1)[0]);
  const idxEmail = fields.findIndex(({ name }) => name === 'email');
  fields.splice(1, 0, fields.splice(idxEmail, 1)[0]);
  return fields;
}

export function handleRequestError(error) {
  const info = {};
  if (error.response) {
    info.status = error.response.status;
    info.message = error.response.data.message ? error.response.data.message : JSON.stringify(error.response.data);
  } else if (error.request) {
    info.status = 700;
    info.message = 'Network Error';
  } else {
    info.status = 800;
    info.message = error.message;
  }

  return info;
}

export function parseData2Excel(data, fields) {
  let info = [];
  // fields.unshift({ name: "created_at", type: "text", label: "created_at" });
  // fields.unshift({ name: "updated_at", type: "text", label: "updated_at" });

  data.map((item, key) => {
    const propertiesFormat = JSON.parse(item.properties ? item.properties : []);
    item.properties = propertiesFormat;
    info[key] = {};
    info[key]['_id'] = item._id ? item._id : 'UNDEFINED';
    info[key]['checked'] = item.checkedin_at !== 'null' ? 'TRUE' : 'FALSE';

    info[key]['Hora checkIn'] = item.checked_at
      ? item.checked_at
        ? item.checked_at.toDate()
        : ''
      : item.checkedin_at
      ? item.checkedin_at
      : '';
    fields.map(({ name, type, label }) => {
      let str;
      switch (type) {
        case 'number':
          str = item.properties[name] ? item.properties[name].toString() : 'udenfined';
          break;
        case 'boolean':
          str = item.properties[name] ? 'TRUE' : 'FALSE';
          break;
        case 'complex':
          str = item.properties[name] ? item.properties[name].response : 'undefined';
          break;
        case 'multiplelist':
          str = Array.isArray(item.properties[name]) ? item.properties[name].join() : item.properties[name];
          break;
        case 'file':
          str =
            item.properties[name] && item.properties[name].file
              ? item.properties[name].file.response
              : item.properties[name];
          break;
        default:
          str = name === 'id' ? item['_id'] : item.properties[name] ? item.properties[name] : 'undefined';
      }

      if (type === 'complex' && str) {
        Object.keys(str).map((prop) => {
          return (info[key][prop] = Array.isArray(str[prop]) ? str[prop].join() : str[prop]);
        });
      } else return (info[key][label] = str);

      return null;
    });
    if (item.rol) info[key]['rol'] = item.rol.label ? item.rol.label.toUpperCase() : '';
    info[key]['Tipo asistente'] = item.rol_name ? item.rol_name : '';
    info[key]['Actualizado'] = item.updated_at;
    info[key]['Creado'] = item.created_at;
    return info;
  });
  return info;
}

export const sweetAlert = {
  showLoading: (title, text) =>
    Swal.fire({
      title,
      text,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    }),
  hideLoading: () => Swal.close(),
  twoButton: (title, type, showCancelButton, confirmButtonText, cb) =>
    Swal.fire({ title, type, showCancelButton, confirmButtonText, confirmButtonColor: '#1CDCB7' }).then((result) =>
      cb(result)
    ),
  showSuccess: (title, text) => Swal.fire({ title, text, type: 'success' }),
  showError: (error) => Swal.fire({ title: error.status, text: error.message, type: 'error' }),
  simple: (title, html, confirmLabel, confirmColor, cb) =>
    Swal.fire({ title, html, confirmButtonColor: confirmColor, confirmButtonAriaLabel: confirmLabel }).then((result) =>
      cb(result)
    ),
};

export function getDatesRange(rangeStartDate, rangeEndDate, dateFormat = 'YYYY-MM-DD') {
  const startDate = moment(rangeStartDate);
  const endDate = moment(rangeEndDate);

  if (startDate.isValid() && endDate.isValid() && startDate.isBefore(endDate)) {
    const datesRange = [startDate.format(dateFormat)];
    let nextDay = startDate.add(1, 'day');

    while (nextDay.isBefore(endDate)) {
      datesRange.push(nextDay.format(dateFormat));
      nextDay = nextDay.add(1, 'day');
    }

    datesRange.push(endDate.format(dateFormat));

    return datesRange;
  } else if (startDate.isValid() && endDate.isValid() && startDate.isSame(endDate)) {
    return [startDate.format(dateFormat)];
  }

  return [];
}

export function formatDataToString(data, property) {
  const validationType = typeof data;
  let result = '';
  if (validationType === 'object') {
    if (!(data === null)) {
      if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          result += data[i] + '\n';
        }
      } else {
        // start object

        if (property) {
          if (property.type === 'file') {
            const { fileList } = data;
            result = (
              <ul>
                {fileList.map((item, index) => {
                  return (
                    <li key={'item-files-' + index}>
                      <a href={item.response} target='_blank' rel='noreferrer'>
                        {item.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            );
          }
        } else {
          result = JSON.stringify(data);
        }
      }
    }
  } else {
    result = data;
  }
  return result;
}
