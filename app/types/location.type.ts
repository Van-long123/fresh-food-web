export interface GhnProvince {
  ProvinceID: number
  ProvinceName: string
}

export interface GhnDistrict {
  DistrictID: number
  DistrictName: string
  ProvinceID: number
}

export interface GhnWard {
  WardCode: string
  WardName: string
  DistrictID: number
}
