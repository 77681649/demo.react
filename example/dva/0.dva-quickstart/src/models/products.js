/**
 * 数据处理和业务逻辑
 */
export default {
  namespace: "products",
  state: [
    {
      id: 1,
      name: "iPhone"
    },
    {
      id: 2,
      name: "iPad"
    }
  ],
  reducers: {
    delete(state, { payload: id }) {
      return state.filter(item => item.id !== id);
    }
  }
};
