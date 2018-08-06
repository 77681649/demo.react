import { NAMESPACE_SEP } from "./constants";

/**
 * 尝试为action.type添加前缀namespace
 *  
 * if action.type is reducer or effect
 *  -> namespace/action.type
 * else
 *  -> action.type
 *
 * @param {string} type action.type 原始的action.type
 * @param {dva.Model} model model实例
 * @returns {String} 返回action.type
 */
export default function prefixType(type, model) {
  // 有前缀的action.type namespace/action.type
  const prefixedType = `${model.namespace}${NAMESPACE_SEP}${type}`;

  // 去掉后缀"@@..."
  const typeWithoutAffix = prefixedType.replace(/\/@@[^/]+?$/, "");

  const { reducers, effects } = model;

  if (
    (reducers && reducers[typeWithoutAffix]) ||
    (effects && effects[typeWithoutAffix])
  ) {
    return prefixedType;
  }

  return type;
}