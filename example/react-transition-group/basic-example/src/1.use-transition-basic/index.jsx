/**
 * 1.use-transition-basic
 * 使用Transition 组件实现 enter,leave的动画
 */
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Transition } from "react-transition-group";

const duration = 300;
const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`
};

const transitionStyle = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 }
};

const Banner = ({ style }) => <div style={style}>This is a banner.</div>;

class FadeBanner extends Component {
  render() {
    let { in: inProps } = this.props;

    return (
      <Transition
        in={inProps}
        timeout={duration}
        mountOnEnter
        unmountOnExit
        onEnter={() => console.log("enter")}
        onEntering={() => console.log("entering")}
        onEntered={() => console.log("entered")}
        onExit={() => console.log("exit")}
        onExiting={() => console.log("exiting")}
        onExited={() => console.log("exited")}
      >
        {state => {
          console.log("render state:", state);
          // 根据状态变换样式
          let currentTransitionstyle = transitionStyle[state];
          let style = currentTransitionstyle
            ? {
                ...currentTransitionstyle,
                ...defaultStyle
              }
            : null;

          return <Banner style={{ ...style }} />;
        }}
      </Transition>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.handleAddClick = ::this.handleAddClick;
    this.handleRemoveClick = ::this.handleRemoveClick;
  }

  state = {
    showBanner: false
  };

  render() {
    return (
      <React.Fragment>
        <div>
          <div>Add/Remove banner:</div>
          <button onClick={this.handleAddClick}>Add</button>
          <button onClick={this.handleRemoveClick}>Remove</button>
        </div>
        <div>
          <FadeBanner in={this.state.showBanner} />
        </div>
      </React.Fragment>
    );
  }

  handleAddClick() {
    this.setState({ showBanner: true });
  }

  handleRemoveClick() {
    this.setState({ showBanner: false });
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
