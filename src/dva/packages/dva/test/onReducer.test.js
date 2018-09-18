import dva from '../src/index';
import {createMemoryHistory} from 'history'
import { StaticRouter } from 'react-router-dom'

// 1. Initialize
const app = dva({
  history:createMemoryHistory()
});

// 2. Plugins
app.use({
  onError(err, dispatch, extension) {
    console.log(err);
    console.log(dispatch);
    console.log(extension);
  },
  onReducer(reducer) {
    return (state, action) => {
      console.log('reducer-enchaner 1')
      return reducer(state, action);
    };
  },
});

app.use({
  onError(err, dispatch, extension) {
    console.log(err);
    console.log(dispatch);
    console.log(extension);
  },
  onReducer(reducer) {
    return (state, action) => {
      console.log('reducer-enchaner 2')
      return reducer(state, action);
    };
  },
});

// 3. Model
// app.model(require('./models/example').default);

// 4. Router
app.router(function ({ history, app, ...props}){
  return <StaticRouter></StaticRouter>
});

// 5. Start
app.start('#root');
