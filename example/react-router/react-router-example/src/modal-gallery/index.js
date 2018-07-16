/**
 * modal-gallery
 *
 */
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

const images = [
  { id: 0, title: "Dark Orchid", path: "/img/0" },
  { id: 1, title: "Lime Green", path: "/img/1" },
  { id: 2, title: "Tomato", path: "/img/2" },
  { id: 3, title: "Seven Ate Nine", path: "/img/3" },
  { id: 4, title: "Crimson", path: "/img/4" }
];

const getImage = id => images.find(i => i.id == id);

const featuredImages = [2, 4];

const Image = () => null;

const ImageDialog = () => null;

const FeaturedImages = () => {
  let images = featuredImages.map(getImage);

  return (
    <div>
      <h4>Featured Images:</h4>
      <ul>
        {images.map(({ id, title, path }) => (
          <li key={id}>
            <Link to={path}>{title}</Link>
          </li>
        ))}
      </ul>
      <Switch>
      {images.map(({ id,  path }) => (
          <Route path={path} exact render=({}=> <Image ß) />
      ))}
      </Switch>
    </div>
  );
};

const Home = () => (
  <div>
    <Link to="/gallery">Visit the Gallery</Link>
    <FeaturedImages />
  </div>
);

const Gallery = () => null;

const App = () => (
  <Router>
    <React.Fragment>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/gallery" component={Gallery} />
      </Switch>
    </React.Fragment>
  </Router>
);

ReactDOM.render(<App />, document.getElementById("root"));
