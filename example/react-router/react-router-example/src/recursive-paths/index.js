import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";

const users = [
  { id: 0, name: "Michelle", friends: [1, 2, 3] },
  { id: 1, name: "Sean", friends: [0, 3] },
  { id: 2, name: "Kim", friends: [0, 1, 3] },
  { id: 3, name: "David", friends: [1, 2] }
];

const getUser = id => {
  return users.find(u => u.id == id);
};

const Person = ({ id, match: parentMatch }) => {
  let { name, friends } = getUser(id);
  let prefixPath = parentMatch ? parentMatch.url : "";

  return (
    <div>
      <h4>{name}’s Friends</h4>
      <React.Fragment>
        <ul>
          {friends.map(friendId => {
            let { name } = getUser(friendId);

            return (
              <li key={friendId}>
                <Link to={`${prefixPath}/${friendId.toString()}`}>{name}</Link>
              </li>
            );
          })}
        </ul>
        <Switch>
          <Route path={`${prefixPath}/:id`}>
            {({ match }) => {
              return <Person id={match.params.id} match={match} />;
            }}
          </Route>
        </Switch>
      </React.Fragment>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <Person id={0} />
  </BrowserRouter>
);

ReactDOM.render(<App />, document.getElementById("root"));
