import { ref, computed, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { isValidPhone } from '~/utils/authFormUtils'
import { useLocation } from '~/composables/location/useLocation'
import {
  useAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation
} from '~/queries/address/useAddressQueries'
import type { Address as ApiAddress } from '~/types/address.type'

export type AddressFormType = {
  id?: string
  fullName: string
  phone: string
  street: string
  ward: string
  district: string
  city: string
  isDefault: boolean
}

export const useAddress = () => {
  const toast = useToast()
  const confirm = useConfirm()

  const { data: addresses, isLoading: isAddressesLoading } = useAddressesQuery()
  const createMutation = useCreateAddressMutation()
  const updateMutation = useUpdateAddressMutation()
  const deleteMutation = useDeleteAddressMutation()

  const selectedAddressId = computed(() => {
    return addresses.value?.find((a) => a.default === 1)?._id || null
  })

  const modalMode = ref<'create' | 'edit'>('create')
  const editingId = ref<string | null>(null)
  const showAddressModal = ref(false)

  const addressForm = ref<AddressFormType>({
    fullName: '',
    phone: '',
    street: '',
    ward: '',
    district: '',
    city: 'Đà Nẵng',
    isDefault: false,
  })

  const {
    provinces,
    districts,
    wards,
    isLoadingProvinces,
    isLoadingDistricts,
    isLoadingWards,
  } = useLocation(
    computed(() => addressForm.value.city),
    computed(() => addressForm.value.district),
  )

  const provinceOptions = computed(() =>
    provinces.value.map((p: any) => ({
      label: p.ProvinceName,
      value: p.ProvinceName,
    })),
  )
  const districtOptions = computed(() =>
    districts.value.map((d: any) => ({
      label: d.DistrictName,
      value: d.DistrictName,
    })),
  )
  const wardOptions = computed(() =>
    wards.value.map((w: any) => ({ label: w.WardName, value: w.WardName })),
  )

  watch(
    () => addressForm.value.city,
    () => {
      addressForm.value.district = ''
      addressForm.value.ward = ''
    },
  )

  watch(
    () => addressForm.value.district,
    () => {
      addressForm.value.ward = ''
    },
  )

  const wasSubmitted = ref(false)
  const validationErrors = ref<{ [k: string]: string }>({})

  const openCreateAddress = () => {
    modalMode.value = 'create'
    editingId.value = null
    addressForm.value = {
      fullName: '',
      phone: '',
      street: '',
      ward: '',
      district: '',
      city: 'Đà Nẵng',
      isDefault: addresses.value?.length === 0, // force true if no addresses
    }
    wasSubmitted.value = false
    validationErrors.value = {}
    showAddressModal.value = true
  }

  const openEditAddress = (a: ApiAddress) => {
    modalMode.value = 'edit'
    editingId.value = a._id
    
    addressForm.value = {
      fullName: a.username,
      phone: a.phone,
      street: a.address,
      city: a.province,
      district: a.district,
      ward: a.ward,
      isDefault: a.default === 1,
    }
    
    wasSubmitted.value = false
    validationErrors.value = {}
    showAddressModal.value = true
  }

  const validateAddressForm = (): boolean => {
    validationErrors.value = {}
    if (!addressForm.value.fullName || !String(addressForm.value.fullName).trim()) {
      validationErrors.value.fullName = 'Tên người nhận là bắt buộc.'
    }
    if (!addressForm.value.phone || !isValidPhone(String(addressForm.value.phone))) {
      validationErrors.value.phone = 'Số điện thoại không hợp lệ.'
    }
    if (!addressForm.value.street || !String(addressForm.value.street).trim()) {
      validationErrors.value.street = 'Địa chỉ chi tiết là bắt buộc.'
    }
    if (!addressForm.value.city) {
      validationErrors.value.city = 'Vui lòng chọn Tỉnh/Thành.'
    }
    if (!addressForm.value.district) {
      validationErrors.value.district = 'Vui lòng chọn Quận/Huyện.'
    }
    if (!addressForm.value.ward) {
      validationErrors.value.ward = 'Vui lòng chọn Phường/Xã.'
    }
    return Object.keys(validationErrors.value).length === 0
  }

  const saveAddress = () => {
    wasSubmitted.value = true
    if (!validateAddressForm()) return

    const selectedProvince = provinces.value.find((p: any) => p.ProvinceName === addressForm.value.city)
    const selectedDistrict = districts.value.find((d: any) => d.DistrictName === addressForm.value.district)
    const selectedWard = wards.value.find((w: any) => w.WardName === addressForm.value.ward)

    const payload = {
      username: addressForm.value.fullName,
      phone: addressForm.value.phone,
      address: addressForm.value.street,
      province: selectedProvince?.ProvinceName || addressForm.value.city,
      district: selectedDistrict?.DistrictName || addressForm.value.district,
      ward: selectedWard?.WardName || addressForm.value.ward,
      province_id: selectedProvince?.ProvinceID || 201, // 201 is Da Nang
      district_id: selectedDistrict?.DistrictID || 0,
      ward_code: selectedWard?.WardCode || '',
      default: addressForm.value.isDefault ? 1 : 0 as 0|1
    }

    if (modalMode.value === 'create') {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.add({ severity: 'success', summary: 'Thành công', detail: 'Thêm địa chỉ thành công', life: 3000 })
          showAddressModal.value = false
        },
        onError: () => {
          toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể thêm địa chỉ', life: 3000 })
        }
      })
    } else if (modalMode.value === 'edit' && editingId.value) {
      updateMutation.mutate({ id: editingId.value, payload }, {
        onSuccess: () => {
          toast.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật địa chỉ thành công', life: 3000 })
          showAddressModal.value = false
        },
        onError: () => {
          toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể cập nhật địa chỉ', life: 3000 })
        }
      })
    }
  }

  const confirmDeleteAddress = (id: string) => {
    confirm.require({
      message: 'Bạn có chắc chắn muốn xóa địa chỉ này?',
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      acceptClass: 'p-button-danger',
      accept: () => {
        deleteMutation.mutate(id, {
          onSuccess: () => {
            toast.add({ severity: 'success', summary: 'Thành công', detail: 'Xóa địa chỉ thành công', life: 3000 })
          },
          onError: () => {
            toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa địa chỉ', life: 3000 })
          }
        })
      }
    })
  }

  const setDefaultAddress = (id: string) => {
    // Only update if it's not already default
    const addr = addresses.value?.find(a => a._id === id)
    if (addr && addr.default === 0) {
      updateMutation.mutate({ id, payload: { ...addr, default: 1 } })
    }
  }

  return {
    addresses,
    isAddressesLoading,
    selectedAddressId,
    modalMode,
    editingId,
    showAddressModal,
    addressForm,
    provinceOptions,
    districtOptions,
    wardOptions,
    isLoadingProvinces,
    isLoadingDistricts,
    isLoadingWards,
    wasSubmitted,
    validationErrors,
    openCreateAddress,
    openEditAddress,
    setDefaultAddress,
    saveAddress,
    confirmDeleteAddress
  }
}
