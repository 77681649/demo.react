const hasOwn = Object.prototype.hasOwnProperty;

function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // x !== x -- NaN
    return x !== x && y !== y;
  }
}

/**
 * 浅比较
 * 1. 比较对象是否相等.
 * 2. 比较对象的直属属性是否相等.
 *
 * @param {any} objA 对象A
 * @param {any} objB 对象B
 * @returns {boolean} true,相等; false,不想等
 */
export default function shallowEqual(objA, objB) {
  // 对象是否相等
  if (is(objA, objB)) return true;

  // 其中有一个为null, 就认为是不相等的
  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  // 比较属性的长度, 不一致认为是不想等的
  if (keysA.length !== keysB.length) return false;

  // 比较属性
  // 不相等的条件,其中有一个属性:
  //  1. 值相等
  //  2. 没有指定的属性
  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}
