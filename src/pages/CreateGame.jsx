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
          level: 14,
          size: 4,
          colors: ["#0288D1", "#BDBDBD", "#FFF3E0", "#CFD8DC"],
          cells: [
            [
              {
                targetRow: 3,
                steps: 3,
                col: 0,
                row: 0,
              },
              {
                targetRow: 0,
                steps: 1,
                col: 1,
                row: 0,
              },
              {
                targetRow: 1,
                steps: 1,
                col: 2,
                row: 0,
              },
              {
                targetRow: 1,
                steps: 1,
                col: 3,
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
                targetRow: 1,
                steps: 1,
                col: 1,
                row: 1,
              },
              {
                targetRow: 0,
                steps: 1,
                col: 2,
                row: 1,
              },
              {
                targetRow: 0,
                steps: 1,
                col: 3,
                row: 1,
              },
            ],
            [
              {
                targetRow: 2,
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
                targetRow: 2,
                steps: 1,
                col: 2,
                row: 2,
              },
              {
                targetRow: 2,
                steps: 1,
                col: 3,
                row: 2,
              },
            ],
            [
              {
                targetRow: 0,
                steps: 2,
                col: 0,
                row: 3,
              },
              {
                targetRow: 3,
                steps: 1,
                col: 1,
                row: 3,
              },
              {
                targetRow: 3,
                steps: 1,
                col: 2,
                row: 3,
              },
              {
                targetRow: 3,
                steps: 2,
                col: 3,
                row: 3,
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
