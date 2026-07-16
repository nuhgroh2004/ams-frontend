import { gql } from '@apollo/client'

export const GET_FILTER_DATA = gql`
  query GetFilterData {
    units {
      id
      nama_unit
    }
    assetCategories {
      id
      nama_kategori
    }
  }
`

export const GENERATE_ASSET_REPORT = gql`
  query GenerateAssetReport($filter: AssetReportFilterInput) {
    generateAssetReport(filter: $filter)
  }
`

export const GENERATE_DEPRECIATION_REPORT = gql`
  query GenerateDepreciationReport($tahun: Int!) {
    generateDepreciationReport(tahun: $tahun)
  }
`

export const GENERATE_MAINTENANCE_REPORT = gql`
  query GenerateMaintenanceReport($filter: MaintenanceReportFilterInput) {
    generateMaintenanceReport(filter: $filter)
  }
`
