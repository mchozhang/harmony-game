/**
 *  graphql queries
 */

import { gql } from "@apollo/client"

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
