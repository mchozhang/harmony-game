/**
 * wrap the app with router and apollo provider which connect to the graphql server
 */
import React from "react"
import "./styles/app.less"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Home from "./pages/Home"
import Game from "./pages/Game"
import NotFoundPage from "./pages/404"
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client"
import { setContext } from "@apollo/client/link/context"

const httpLink = createHttpLink({
  uri: "http://localhost:8080/graphql",
})

const authLink = setContext((_, { headers }) => {
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers," +
        " Access-Control-Allow-Origin, X-Requested-With, content-type, Authorization",
    },
  }
})

const client = new ApolloClient({
  uri: "http://localhost:8080/graphql",
  // link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Request-Headers":
      "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Headers, X-Requested-With, content-type, Authorization",
    "Access-Control-Allow-Headers":
      "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Headers, X-Requested-With, content-type, Authorization",
  },
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
