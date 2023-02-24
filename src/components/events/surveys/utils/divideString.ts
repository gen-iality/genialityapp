export const divideString = (string: string) => {
  let separatedByWhiteSpace = string.split(/\s/);
  let times;
  let text = [];

  if (string.length > 140) {
    times = 3;
  } else {
    times = 2;
  }

  for (let index = times; index > 0; index--) {
    const m1 = separatedByWhiteSpace.splice(0, separatedByWhiteSpace.length / index);
    const m2 = m1.join(' ');
    text.push(m2);
  }
  return text;
};