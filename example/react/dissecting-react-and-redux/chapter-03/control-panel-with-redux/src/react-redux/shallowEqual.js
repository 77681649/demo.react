export default function shallowEqual(objA, objB) {
  if (!objA || !objB) {
    return false;
  }

  let aKeys = Object.keys(objA);
  let bKeys = Object.keys(objB);

  if (aKeys.length != bKeys.length) {
    return false;
  }

  return !aKeys.some(k => objA[k] != objB[k]);
}
