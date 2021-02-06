/**
 * top bar
 */
import { Layout } from "antd"
import React from "react"
import { NavLink } from "react-router-dom"
import "../styles/header.less"

const { Header } = Layout

const TopBar = (props) => {
  return (
    <Header>
      <NavLink to={"/"} className="logo">
        Harmony Game
      </NavLink>
    </Header>
  )
}

export default TopBar
