import { createStore } from 'redux'
import rootReducer from './reducers'

export default function create() {
  return createStore(rootReducer)
}
