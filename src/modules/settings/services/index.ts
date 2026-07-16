import { gql } from '@apollo/client'

export const GET_SETTINGS = gql`
  query GetSettings {
    settings {
      id
      key
      value
      description
    }
  }
`

export const UPDATE_SETTINGS = gql`
  mutation UpdateSettings($input: [SettingInput!]!) {
    updateSettings(input: $input) {
      id
      key
      value
    }
  }
`
