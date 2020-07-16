import { Layout } from "antd"
import React from "react"
import LevelGrid from "../components/LevelGrid"
import GameGrid from "../components/GameGrid"

const { Header, Content } = Layout

const Home = (props) => {
  return (
    <Layout>
      <Header>Harmony Game</Header>
      <Content>
        <LevelGrid />
      </Content>
    </Layout>
  )
}

export default Home
