type Location {
id: ID!
nama_gedung: String
lantai: String
ruangan: String
kode_lokasi: String
unit_id: ID
unit: Unit
}

type CreateLocationInput {
nama_gedung: String!
lantai: String
ruangan: String
kode_lokasi: String
unit_id: ID
}

type UpdateLocationInput {
nama_gedung: String
lantai: String
ruangan: String
kode_lokasi: String
unit_id: ID
}

deleteLocation(
id: ID!
): Boolean!