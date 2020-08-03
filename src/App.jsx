/**
 * wrap the app with router and apollo provider which connect to the graphql server
 */
import React from "react"
import "./styles/app.less"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Home from "./pages/Home"
import Game from "./pages/Game"
import NotFoundPage from "./pages/NotFound"
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import config from "./config/config.json"
import CreateGame from "./pages/CreateGame"

const client = new ApolloClient({
  uri: config.serverEndpoint,
  cache: new InMemoryCache(),
})

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/level/:id" component={Game} />
          <Route path="/create-game" component={CreateGame} />
          <Route component={NotFoundPage} />
        </Switch>
      </Router>
    </ApolloProvider>
  )
}

export default App
