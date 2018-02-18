const getStrTimer = (ms) => {
  const hourInMS = 1000 * 60 * 60;
  const minInMS = 1000 * 60;
  // const secInMs = 1000;

  let countTail = ms;
  const hourPart = Math.floor(countTail / hourInMS);
  countTail -= hourPart * hourInMS;

  const minPart = Math.floor(countTail / minInMS);
  countTail -= minPart * minInMS;

  // const secPart = Math.floor(countTail / secInMs);

  return `${hourPart}ч ${minPart}м`;
};
export default getStrTimer;
