/**
 * Page enabling admin to create a new game
 */
import React, { useRef, useState } from "react"
import { Button, Col, Input, InputNumber, Row } from "antd"
import { useLazyQuery, useMutation } from "@apollo/client"
import { CREATE_LEVEL, GET_LEVEL } from "../utils/GraphQL"

const CreateGame = (props) => {
  const [createLevel] = useMutation(CREATE_LEVEL)
  const [size, setSize] = useState(5)

  // dom refs
  const levelInput = useRef()
  const sizeInput = useRef()
  const colorInputs = useRef({})
  const stepInputs = useRef({})
  const targetRowInputs = useRef({})

  // row components
  const rows = getRows()

  function getRows() {
    let result = []
    for (let i = 0; i < size; i++) {
      let cellInputs = []
      for (let j = 0; j < size; j++) {
        cellInputs.push(
          <Col key={j}>
            <InputNumber
              ref={(ref) => (stepInputs.current[`${i},${j}`] = ref)}
            />
            <InputNumber
              ref={(ref) => (targetRowInputs.current[`${i},${j}`] = ref)}
              style={{ marginRight: 10 }}
            />
          </Col>
        )
      }
      result.push(
        <Row key={i} style={{ marginTop: 10 }}>
          <Col>
            <Input
              placeholder="color"
              ref={(ref) => (colorInputs.current[i] = ref)}
            />
          </Col>
          {cellInputs}
        </Row>
      )
    }
    return result
  }

  /**
   * callback of the query, update the data of the inputs
   */
  const updateData = () => {
    if (data != null) {
      sizeInput.current.state.value = data.level.size
      for (let i = 0; i < data.level.size; i++) {
        colorInputs.current[i].state.value = data.level.colors[i]
        for (let j = 0; j < data.level.size; j++) {
          stepInputs.current[`${i},${j}`].state.value =
            data.level.cells[i][j].steps
          targetRowInputs.current[`${i},${j}`].state.value =
            data.level.cells[i][j].targetRow
        }
      }
    }
  }

  // query level data
  const [getLevel, { error, data }] = useLazyQuery(GET_LEVEL, {
    onCompleted: updateData,
  })

  const handleSubmit = () => {
    let level = levelInput.current.state.value
    let colorList = []
    for (let i = 0; i < size; i++) {
      colorList.push(colorInputs.current[i].state.value)
    }

    let grid = []
    for (let i = 0; i < size; i++) {
      let row = []
      for (let j = 0; j < size; j++) {
        row.push({
          row: i,
          col: j,
          steps: stepInputs.current[`${i},${j}`].state.value,
          targetRow: targetRowInputs.current[`${i},${j}`].state.value,
        })
      }
      grid.push(row)
    }

    createLevel({
      variables: {
        input: {
          level: level,
          size: size,
          colors: colorList,
          cells: grid,
        },
      },
    })
  }

  const onLevelChanged = (value) => {
    getLevel({
      variables: { id: value },
    })
  }

  const onSizeChanged = (value) => {
    setSize(value)
  }

  return (
    <>
      <InputNumber
        placeholder="size"
        ref={sizeInput}
        onChange={onSizeChanged}
      />
      <InputNumber
        placeholder="level"
        ref={levelInput}
        onChange={onLevelChanged}
      />
      {rows}
      <Button onClick={() => handleSubmit()}>submit</Button>
    </>
  )
}

export default CreateGame
