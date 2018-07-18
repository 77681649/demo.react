import React from "react";
import AddTodo from "./AddTodo";
import TodoList from "./TodoList";

const data = [
  { id: 0, text: "Buy eggs" },
  { id: 1, text: "Pay bills" },
  { id: 2, text: "Fix the TV" }
];

let genNextId = (() => {
  let nextId = data.length;
  return () => nextId++;
})();

export default class Todos extends React.Component {
  constructor(props) {
    super(props);

    this.handleAddTodoClick = this.handleAddTodoClick.bind(this);
    this.handleDeleteTodoClick = this.handleDeleteTodoClick.bind(this);
  }

  state = {
    data: data
  };

  render() {
    return (
      <div className="todos">
        <TodoList
          todos={this.state.data}
          onTodoDelete={this.handleDeleteTodoClick}
        />
        <AddTodo onClick={this.handleAddTodoClick} />
      </div>
    );
  }

  handleAddTodoClick() {
    let text = window.prompt("Enter some text");

    if (text) {
      this.setState({
        data: this.state.data.concat({
          id: genNextId(),
          text
        })
      });
    }
  }

  handleDeleteTodoClick(id) {
    let data = [].concat(this.state.data);
    let index = data.findIndex(it => it.id === id);

    if (~index) {
      data.splice(index, 1);

      this.setState({
        data
      });
    }
  }
}
