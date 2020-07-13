import { Layout } from "antd";
import React from "react";
import LevelGrid from "../components/LevelGrid";

const { Header, Content, Footer } = Layout;

const Home = (props) => {
  return (
    <Layout>
      <Header>Harmony Game</Header>
      <Content>
        <LevelGrid />
      </Content>
      <Footer></Footer>
    </Layout>
  );
};

export default Home;
