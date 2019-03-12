# react-redux

---

---

目录

-   react-redux 概述
-   react-redux API
    -   react-redux API: \<Provider>
    -   react-redux API: connect()
-   react-redux 实战

---

## react-redux 概述

### react-reudx 简介

将 react 与 redux 连接, 从而可以让 react 与 redux 之间相互通信

| 数据流         | 操作                         | 实现方式        |
| -------------- | ---------------------------- | --------------- |
| react -> redux | 更新数据 ( redux state )     | dispatch action |
| redux -> react | 更新视图 ( react component ) | setState        |

### 组件分离: 容器组件 vs 展示组件

### 为什么要分类 ?

-   更易于复用

#### 容器组件 vs 展示组件

-   容器组件: smart/fat/stateful/container component
-   展示组件: dumb/skiny/pure/presentational component

|                    |                                  |                                           |
| ------------------ | -------------------------------- | ----------------------------------------- |
|                    | 渲染组件                         | 容器组件 smart/container/skinny component |
| 作用               | 描述如何展现 ( 布局, 样式 )      | 描述如何运行 ( 数据获取, 状态更新 )       |
| 是否直接使用 redux | NO                               | YES                                       |
| 数据来源           | props                            | redux state                               |
| 数据修改方式       | 调用 props 中的回调函数 ( onXX ) | redux: dispatch action                    |
| 创建方式           | 手动                             | react-redux connect 生成                  |

## react-redux API

### react-redux API: <Provider>

#### 功能

提供 redux.store - 通过 context 的形式, 为 react 组件提供 store 的引用

#### \<Provider> 说明

**属性说明:**
| 属性 | 说明 |
| --- | --- |
| store | redux.store |
| children | 根组件 |

```javascript
import { Provider } from 'react-redux'

<Provider store={store}>
    <App />
</Provider>
```

### react-redux API: connect()

#### 功能

连接 - 将 react 组件与 redux store 连接起来, 连接的组件可以实现如下功能:

-   监听 store 变化: 只要 store 有数据变化, 就会通知连接组件更新
-   分发 action:

#### connect() 说明

```javascript
const ContainerComponent = connect(
	[mapStateToProps],
	[mapDispatchToProps],
	[mergeProps],
	[options]
)(PresentationalComponent);
```

**参数说明:**
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| [mapStateToProps]| function | 映射需要的数据, 合并到组件的 props |
| [mapDispatchToProps] | function,object | 映射需要的 actionCreator,合并到组件的 props |
| [mergeProps] | function | 自定义合并 props 方式 |
| [options] | object | 选项 |
| withConnect | function | 返回一个高阶组件(HOC), 用来包装指定的展示组件 |

**mapStateToProps:**

state -> props

```javascript
// jsx
function Button(props) {
	return <button className={props.className}>{props.name}</button>;
}

// 1. mapStateToProps = null
// 不监听state变化
const Container = connect()(Button);

// 2. mapStateToProps = (state) -> object
// 3. mapStateToProps = (state,ownProps) -> object
// 监听state:
//  - 通过selector函数, 选择需要的数据, 合并到props中
//  - 监听state, 当state发生变化时, 会重新执行selector函数, 获得最新的mapState之后, 更新组件
const Container = connect(function selector(state, ownProps) {
	// state: 表示redux store, 即可 state = store.getState()
	// ownProps: 表示容器自身拥有的属性 { className:"btn" }

	// 返回一个纯对象
	// [推荐] selector可以对数据进行变换(map)
	return {
		name: state.fisrtName + '/' + state.lastName,
	};
})(Button);

// 渲染
ReactDOM.render(<Container className="btn" />);
```

**mapDispatchToProps:**

```javascript
// 1. mapDispatchToProps = null
// dispatch to props
// Button 内部可以通过 this.props.dispatch 分发action
const Container = connect()(Button);

// 2. mapDispatchToProps = (dispatch) -> object
// 3. mapDispatchToProps = (dispatch,ownProps) -> object
// 选择需要的分发的action, 合并到props中
const Container = connect(
	null,
	function mapDispatchToProps(dispatch) {
		// 返回一个纯对象
		// 组件中调用方式: this.props.onClick()
		return {
			onClick: function() {
				dispatch({ type: 'clickButton' });
			},
		};
	}
);

// 4. mapDispatchToProps = object
// 自动调用dispatch
const Container = connect(
	null,
	// 一个纯对象
	// 等价于 dispatch(onClick())
	{
		// 组件中调用方式: this.props.onClick()
		onClick: function() {
			return { type: 'clickButton' };
		},
	}
);
```

**mergeProps:**

**options:**

**withConnect:**

```javascript
const Container = connect()(Button);
```

## react-redux 实战
