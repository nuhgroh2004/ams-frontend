export interface Role {
  id: string;
  nama_role: string;
}

export interface Unit {
  id: string;
  nama_unit: string;
  kode_unit: string;
}

export interface User {
  id: string;
  nama_lengkap: string;
  nrp: string;
  email: string;
  gender: string; // Tambahkan ini
  unit_id: string;
  jabatan: string;
  roles: Role[];
  unit: Unit;
}

export interface AuthResponse {
  login: {
    token: string;
    user: User;
  };
}

export interface RegisterResponse {
  register: {
    token: string;
    // Tambahkan 'nrp' dan 'gender' di sini
    user: Pick<User, 'id' | 'nama_lengkap' | 'email' | 'roles' | 'nrp' | 'gender'>;
  };
}