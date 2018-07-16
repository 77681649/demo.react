/**
 * 1.use-transition-add-enter-and-leave-animation
 * 使用Transition 组件实现 enter,leave的动画
 */
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import "./index.css";

const duration = 300;
const Banner = () => <div>This is a banner.</div>;

class FadeBanner extends Component {
  render() {
    let { in: inProps } = this.props;

    return (
      <CSSTransition
        in={inProps}
        timeout={duration}
        classNames={{
          enter: "fade-in",
          enterActive: "fade-in-active",
          enterDone: "fade-in-done",
          exit: "fade-out",
          exitActive: "fade-out-active",
          extDone: "fade-out-done"
        }}
        mountOnEnter
        unmountOnExit
        onEnter={() => console.log("enter")}
        onEntering={() => console.log("entering")}
        onEntered={() => console.log("entered")}
        onExit={() => console.log("exit")}
        onExiting={() => console.log("exiting")}
        onExited={() => console.log("exited")}
      >
        <Banner />
      </CSSTransition>
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
