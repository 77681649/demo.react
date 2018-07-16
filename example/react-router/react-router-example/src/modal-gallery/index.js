/**
 * modal-gallery
 *
 */
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import "./index.css";

const images = [
  { id: 0, title: "Dark Orchid", bgColor: "darkorchid" },
  { id: 1, title: "Lime Green", bgColor: "limegreen" },
  { id: 2, title: "Tomato", bgColor: "tomato" },
  {
    id: 3,
    title: "Seven Ate Nine",
    bgColor: "rgb(119, 136, 153)"
  },
  { id: 4, title: "Crimson", bgColor: "crimson" }
];

const getImage = id => images.find(i => i.id == id);

const featuredImages = [2, 4];

const ImageView = ({ match: { params } }) => {
  let { title, bgColor } = getImage(params.id);

  return <Image title={title} bgColor={bgColor} />;
};

const Image = ({ title, bgColor }) => (
  <div>
    <h4>{title}</h4>
    <div className="color-pannel" style={{ background: bgColor }} />
  </div>
);

const ImageModalDialog = ({ match, history }) => {
  const image = getImage(parseInt(match.params.id, 10));
  if (!image) {
    return null;
  }

  const { title, bgColor } = image;

  const back = e => {
    e.stopPropagation();
    history.goBack();
  };

  return (
    <div
      onClick={back}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        background: "rgba(0, 0, 0, 0.15)"
      }}
    >
      <div
        className="modal"
        style={{
          position: "absolute",
          background: "#fff",
          top: 25,
          left: "10%",
          right: "10%",
          padding: 15,
          border: "2px solid #444"
        }}
      >
        <Image title={title} bgColor={bgColor} />
        <button type="button" onClick={back}>
          Close
        </button>
      </div>
    </div>
  );
};

const FeaturedImages = () => {
  let images = featuredImages.map(getImage);

  return (
    <div>
      <h4>Featured Images:</h4>
      <ul>
        {images.map(({ id, title }) => (
          <li key={id}>
            <Link to={`/img/${id}`}>{title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Home = () => (
  <div>
    <Link to="/gallery">Visit the Gallery</Link>
    <FeaturedImages />
  </div>
);

const Gallery = () => (
  <React.Fragment>
    <ul className="gallery">
      {images.map(({ id, title, bgColor }) => (
        <li key={id}>
          <div style={{ background: bgColor, width: "40px", height: "40px" }} />
          <div>
            <Link
              to={{
                pathname: `/img/${id}`,
                state: {
                  modal: true
                }
              }}
            >
              {title}
            </Link>
          </div>
        </li>
      ))}
    </ul>
  </React.Fragment>
);

class ModalSwitch extends Component {
  previousLocation = this.props.location;

  componentWillUpdate(nextProps) {
    const { location } = this.props;
    // set previousLocation if props.location is not modal
    if (
      nextProps.history.action !== "POP" &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location;
    }
  }

  render() {
    const { location } = this.props;
    const isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location
    ); // not initial render

    return (
      <React.Fragment>
        <Switch location={isModal ? this.previousLocation : location}>
          <Route path="/" exact component={Home} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/img/:id" component={ImageView} />
        </Switch>
        {isModal ? (
          <Route path="/img/:id" component={ImageModalDialog} />
        ) : null}
      </React.Fragment>
    );
  }
}

const App = () => (
  <Router>
    <Route path="*" component={ModalSwitch} />
  </Router>
);

ReactDOM.render(<App />, document.getElementById("root"));
