import { NAMESPACE_SEP } from './constants';

/**
 * 为action.type, 添加namespace前缀
 * 如果 namespace/type 在model中存在, 返回 namespace/type
 * 否则 返回type
 * 
 * @param {string} type action.type
 * @param {dva.Model} model model实例
 * @returns {String}
 */
export default function prefixType(type, model) {
  // namespace/effect
  const prefixedType = `${model.namespace}${NAMESPACE_SEP}${type}`;
  
  const typeWithoutAffix = prefixedType.replace(/\/@@[^/]+?$/, '');

  if ((model.reducers && model.reducers[typeWithoutAffix])
    || (model.effects && model.effects[typeWithoutAffix])) {
    return prefixedType;
  }

  return type;
}
