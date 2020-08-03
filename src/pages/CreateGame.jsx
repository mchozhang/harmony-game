/**
 * Page enabling admin to create a new game
 */
import React from "react"
import { Button } from "antd"
import { useMutation } from "@apollo/client"
import { CREATE_LEVEL } from "../utils/GraphQL"

const CreateGame = (props) => {
  const [createLevel, { data }] = useMutation(CREATE_LEVEL)
  const handleSubmit = () => {
    createLevel({
      variables: {
        input: {
          level: 3,
          size: 3,
          colors: ["#EF5350", "#FFAB91", "#FFF8E1"],
          cells: [
            [
              {
                targetRow: 2,
                steps: 1,
                col: 0,
                row: 0,
              },
              {
                targetRow: 1,
                steps: 1,
                col: 1,
                row: 0,
              },
              {
                targetRow: 2,
                steps: 2,
                col: 2,
                row: 0,
              },
            ],
            [
              {
                targetRow: 1,
                steps: 1,
                col: 0,
                row: 1,
              },
              {
                targetRow: 0,
                steps: 1,
                col: 1,
                row: 1,
              },
              {
                targetRow: 0,
                steps: 2,
                col: 2,
                row: 1,
              },
            ],
            [
              {
                targetRow: 0,
                steps: 1,
                col: 0,
                row: 2,
              },
              {
                targetRow: 2,
                steps: 1,
                col: 1,
                row: 2,
              },
              {
                targetRow: 1,
                steps: 2,
                col: 2,
                row: 2,
              },
            ],
          ],
        },
      },
    })
  }

  return <Button onClick={() => handleSubmit()}>submit</Button>
}

export default CreateGame
