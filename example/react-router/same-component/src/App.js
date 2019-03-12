import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Link, BrowserRouter, Switch, Route } from 'react-router-dom'

const HomePage = () => (
  <div>Home</div>
)

const ListPage = () => (
  <div>List {new Date().toString()}</div>
)

const AboutPage = () => (
  <div>About</div>
)

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/list" component={ListPage} />
      <Route path="/about" component={ListPage} />
    </Switch>
  </main >
)

const Header = () => (
  <header>
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/list">List</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </nav>
  </header>

)

const App = () => (
  <React.Fragment>
    <Header />
    <Main />
  </React.Fragment>
)

export default () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
