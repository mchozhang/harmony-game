/**
 * Modal to describe the game rule
 */
import React from "react"
import { Modal, Button } from "antd"
import PropTypes from "prop-types"

const RuleModal = (props) => {
  const setIsModalVisible = props.setVisibility

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <Modal
      title="Game Rule"
      visible={props.visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <p>
        Your task is to put every tile to the correct row. The color of the tile
        indicates the row it belongs.
      </p>
      <p>
        In each move, you can swap 2 tiles in the same row or the same column.
        The number of the stars of tile indicates the remaining steps that it
        can move.
      </p>
      <p>
        You can undo the most recent move or restart the game using the buttons
        in the top bar if made a mistake. Or you can use the hint button below
        to find solutions.
      </p>
    </Modal>
  )
}

RuleModal.propTypes = {
  visible: PropTypes.bool,
  setVisibility: PropTypes.func,
}

export default RuleModal
