import { Component } from 'react';
import dva from 'dva';

let app = dva({
  history: window.g_history,
  <%= ExtendDvaConfig %>
});
<%= EnhanceApp %>
window.g_app = app;

<%= RegisterPlugins %>
<%= RegisterModels %>

class DvaContainer extends Component {
  render() {
    app.router(() => this.props.children);
    return app.start()();
  }
}

export default DvaContainer;
