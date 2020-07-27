/**
 * wrap the app with router and apollo provider which connect to the graphql server
 */
import React from "react"
import "./styles/app.less"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Home from "./pages/Home"
import Game from "./pages/Game"
import NotFoundPage from "./pages/404"
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"

const client = new ApolloClient({
  uri: "http://192.168.0.211:8080/graphql",
  cache: new InMemoryCache(),
})

function App() {



  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/level/:id" component={Game} />
          <Route component={NotFoundPage} />
        </Switch>
      </Router>
    </ApolloProvider>
  )
}

export default App
