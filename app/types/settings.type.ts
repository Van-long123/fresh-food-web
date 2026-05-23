export interface AdminSettings {
  _id?: string
  websiteName: string
  logo: string | File
  phone: string
  email: string
  address: string
  copyright: string
  createdAt?: string
  updatedAt?: string | null
}

export interface AdminSettingsPayload {
  websiteName: string
  logo?: string | File
  phone: string
  email: string
  address: string
  copyright: string
}
