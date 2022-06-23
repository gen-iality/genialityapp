/**
 * We validate if the passed parameter is an object.
 * 
 * @param object Any object
 * @returns true if the passed object is really an object.
 */
const isObject = (object) => {
  return object != null && typeof object === 'object';
};

/**
 * We validate if the keys of the objects are the same as well as their internal data.
 * 
 * @param object1 Object 1.
 * @param object2 Object 2.
 * @returns true if both object are equals.
 */
const deepStateEqualityValidation = (object1, object2) => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const value1 = object1[key];
    const value2 = object2[key];
    const areObjects = isObject(value1) && isObject(value2);

    if ((areObjects && !deepStateEqualityValidation(value1, value2)) || (!areObjects && value1 !== value2)) {
      return false;
    }
  }
  return true;
};

export default deepStateEqualityValidation;
