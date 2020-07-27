/**
 * top bar
 */
import { Layout } from "antd"
import React from "react"
import { Link } from "react-router-dom"

const { Header } = Layout

const TopBar = (props) => {
  return (
    <Link to={"/"}>
      <Header>Harmony Game</Header>
    </Link>
  )
}

export default TopBar
