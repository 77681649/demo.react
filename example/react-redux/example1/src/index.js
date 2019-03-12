import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import './index.css'
import createStore from './createStore'
import App from './components/App'

const AppContainer = () => {
  return (
    <Provider store={createStore()}>
      <App />
    </Provider>
  )
}

ReactDOM.render(<AppContainer />, document.getElementById('root'))
