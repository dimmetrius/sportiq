const padStart = (_str, _targetLength, _padString) => {
  const str = _str.toString();
  let padString = _padString;
  let targetLength = _targetLength;
  padString = padString || ' ';
  if (str.length > targetLength) {
    return str;
  }
  targetLength -= str.length;
  if (targetLength > padString.length) {
    padString += padString.repeat(targetLength / padString.length);
  }
  return padString.slice(0, targetLength) + str;
};

export default padStart;
