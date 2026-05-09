import { computed, unref, type Ref } from 'vue'
import { useProvincesQuery } from '~/queries/location/useProvincesQuery'
import { useDistrictsQuery } from '~/queries/location/useDistrictsQuery'
import { useWardsQuery } from '~/queries/location/useWardsQuery'

export const useLocation = (
  cityName: Ref<string | undefined> | string | undefined,
  districtName: Ref<string | undefined> | string | undefined
) => {
  const { data: rawProvinces, isLoading: isLoadingProvinces } = useProvincesQuery()
  
  const provinces = computed(() => rawProvinces.value || [])

  const provinceIdValue = computed(() => {
    const name = unref(cityName)
    if (!name) return null
    return provinces.value.find((p: any) => p.ProvinceName === name)?.ProvinceID || null
  })

  const { data: rawDistricts, isLoading: isLoadingDistricts } = useDistrictsQuery(provinceIdValue)

  const districts = computed(() => rawDistricts.value || [])

  const districtIdValue = computed(() => {
    const name = unref(districtName)
    if (!name) return null
    return districts.value.find((d: any) => d.DistrictName === name)?.DistrictID || null
  })

  const { data: rawWards, isLoading: isLoadingWards } = useWardsQuery(districtIdValue)

  const wards = computed(() => rawWards.value || [])

  return {
    provinces,
    districts,
    wards,
    isLoadingProvinces,
    isLoadingDistricts,
    isLoadingWards
  }
}
