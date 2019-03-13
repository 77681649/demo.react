import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import withSideEffect from 'react-side-effect'
import { ContainerQuery } from 'react-container-query'
import classnames from 'classnames'

const DocumentTitle = withSideEffect(
  function renderPropsToState(propsList) {
    return last(propsList).title || ''
  },
  function handleStateChangeOnClient(nextTitle) {
    if (nextTitle !== document.title) {
      document.title = nextTitle
    }
  }
)(function DocumentTitle({ children }) {
  if (children) {
    return React.Children.only(children)
  } else {
    return null
  }
})

function last(array) {
  const { length } = array

  return Array.isArray(array) && length > 0 ? array[length - 1] : void 0
}

const containerQuery = {
  'width-s': {
    minWidth: 200,
    maxWidth: 599
  },
  'width-m': {
    minWidth: 600,
    maxWidth: 1023
  },
  'width-l': {
    minWidth: 1024
  }
}

class App extends Component {
  render() {
    const { className } = this.props

    return (
      <DocumentTitle title="Responsive Web DOM">
        <div className={classnames('App', className)}>
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
              Learn React
            </a>
          </header>
        </div>
      </DocumentTitle>
    )
  }
}

export default () => (
  <ContainerQuery query={containerQuery}>
    {params => {
      return <App className={classnames(params)} />
    }}
  </ContainerQuery>
)
