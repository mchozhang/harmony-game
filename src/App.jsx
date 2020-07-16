import React from "react"
import "./App.less"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Home from "./pages/Home"
import Game from "./pages/Game"
import NotFoundPage from "./pages/404"

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/level/:id" component={Game} />
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  )
}

export default App
