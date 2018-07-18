import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Todo from "./Todo";

export default ({ todos, onTodoDelete }) => (
  <TransitionGroup className="todo-list" component="ul">
    {todos
      ? todos.map(({ id, text }) => (
          <CSSTransition
            key={id}
            classNames={{
              appear: "fade-in",
              appearActive: "fade-in-active",
              appearDone: "fade-in-done",
              enter: "fade-in",
              enterActive: "fade-in-active",
              enterDone: "fade-in-done",
              exit: "fade-out",
              exitActive: "fade-out-active",
              extDone: "fade-out-done"
            }}
            appear
            unmountOnExit
            addEndListener={(node, done) => {
              debugger;
              node.addEventListener("transitionend", done);
            }}
            onEnter={() => console.log("enter")}
            onEntering={() => console.log("entering")}
            onEntered={() => console.log("entered")}
            onExit={() => console.log("exit")}
            onExiting={() => console.log("exiting")}
            onExited={() => console.log("exited")}
          >
            <Todo
              text={text}
              onDeleteButtonClick={onTodoDelete.bind(null, id)}
            />
          </CSSTransition>
        ))
      : null}
  </TransitionGroup>
);
