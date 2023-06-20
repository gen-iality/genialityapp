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
  