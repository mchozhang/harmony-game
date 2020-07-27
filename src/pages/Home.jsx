/**
 * The home page displays the level grid
 */
import { Layout } from "antd"
import React from "react"
import LevelGrid from "../components/LevelGrid"
import TopBar from "../components/TopBar"

const { Header, Content } = Layout

const Home = (props) => {
  return (
    <Layout>
      <TopBar />
      <Content>
        <LevelGrid />
      </Content>
    </Layout>
  )
}

export default Home
