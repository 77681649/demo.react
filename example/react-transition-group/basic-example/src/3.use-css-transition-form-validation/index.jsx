/**
 * 3.use-css-transition-form-validation
 * 使用Transition 组件实现 表单验证 过渡动画
 */
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import "./index.css";

const duration = 200;

class FadeForm extends Component {
  constructor(props) {
    super(props);

    this.handleInputFoucs = ::this.handleInputFoucs;
    this.handleInputChange = ::this.handleInputChange;
    this.handleButtonClick = ::this.handleButtonClick;
  }

  state = {
    name: "",
    success: false,
    showValidationMessage: false,
    showValidationButton: true
  };

  UNSAFE_componentWillMount() {
    console.log("componentWillMount", arguments);
  }

  componentDidMount() {
    console.log("componentDidMount", arguments);
  }

  static getDerivedStateFromProps() {
    console.log("getDerivedStateFromProps", arguments);
    return null;
  }

  UNSAFE_componentWillReceiveProps() {
    console.log("componentWillReceiveProps", arguments);
  }

  shouldComponentUpdate() {
    console.log("componentWillReceiveProps", arguments);
    return true;
  }

  UNSAFE_componentWillUpdate() {
    console.log("componentWillUpdate", arguments);
  }

  getSnapshotBeforeUpdate() {
    console.log("getSnapshotBeforeUpdate", arguments);
    return {};
  }

  componentDidUpdate() {
    console.log("componentDidUpdate", arguments);
  }

  render() {
    console.log("render");
    return (
      <form className="form" onSubmit={e => e.preventDefault()}>
        <div className={`form-control ${this.state.success ? "success" : ""}`}>
          <label>Your name</label>
          <div>
            <input
              type="text"
              onFocus={this.handleInputFoucs}
              onChange={this.handleInputChange}
              value={this.state.name}
            />
          </div>
          <CSSTransition
            in={this.state.showValidationMessage}
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
            onEnter={() =>
              this.setState({
                showValidationButton: false
              })
            }
            onExited={() =>
              this.setState({
                success: false,
                showValidationButton: true
              })
            }
          >
            <div className="message">Your names rocks!</div>
          </CSSTransition>
        </div>
        <div className="form-control">
          {this.state.showValidationButton ? (
            <button onClick={this.handleButtonClick}>Validate form</button>
          ) : null}
        </div>
      </form>
    );
  }

  handleInputFoucs() {
    this.setState({
      success: false,
      showValidationMessage: false
    });
  }

  handleInputChange(e) {
    this.setState({ name: e.target.value });
  }

  handleButtonClick() {
    this.setState({
      success: true,
      showValidationMessage: true
    });
  }
}

class App extends Component {
  render() {
    return <FadeForm />;
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
