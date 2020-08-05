/**
 *  graphql mutations and queries
 */

import { gql } from "@apollo/client"

export const CREATE_LEVEL = gql`
  mutation CreateLevel($input: LevelInput!) {
    createLevel(input: $input) {
      size
      colors
      cells {
        targetRow
        steps
        row
        col
      }
    }
  }
`

export const GET_LEVEL = gql`
  query GetLevel($id: Int) {
    level(id: $id) {
      size
      colors
      cells {
        targetRow
        steps
        row
        col
      }
    }
  }
`
