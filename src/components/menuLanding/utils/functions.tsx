import * as iconComponents from '@ant-design/icons';


export function deepCopy(obj : Record<string, any>) : Record<string, any>{
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
    let copy : Record<string, any> =  {};
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          copy[key] = deepCopy(obj[key]);
        }
      }
  
    return copy;
  }
  
 export  const convertArrayToObject  = <T,>(array : Array<T>, key : keyof T) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
      return {
        ...obj,
        [item[key] as string]: item,
      };
    }, initialValue);
  }