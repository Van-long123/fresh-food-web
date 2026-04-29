import { ref, computed, watch } from 'vue'
import { useAuthStore } from '~/stores/useAuthStore'
import { userService } from '~/services/user.service'
import { useToast } from 'primevue/usetoast'
import { isValidPhone, PHONE_FORMAT_MESSAGE } from '~/utils/authFormUtils'

export const useProfile = () => {
  const authStore = useAuthStore()
  const toast = useToast()
  
  const today = new Date()
  const minDate = ref(new Date(today.getFullYear() - 100, today.getMonth(), today.getDate()))
  const maxDate = ref(new Date(today.getFullYear() - 16, today.getMonth(), today.getDate()))

  const user = computed(() => authStore.user)
  
  const formattedBirthday = computed(() => {
    if (!user.value?.birthday) return null
    const [year, month, day] = user.value.birthday.split('-')
    if (!year || !month || !day) return user.value.birthday
    return `${day}/${month}/${year}`
  })

  const isLoading = ref(false)
  const saving = ref(false)
  const saveDone = ref(false)

  const editForm = ref({
    name: '',
    birthday: null as Date | null,
    email: '',
    phone: '',
    gender: 'Nam',
  })

  const avatarFile = ref<File | null>(null)
  const avatarPreview = ref<string | null>(null)

  const userInitial = computed(() => {
    if (!user.value?.fullname) return '?'
    const names = user.value.fullname.trim().split(' ')
    return names[names.length - 1]?.charAt(0).toUpperCase()
  })

  watch(user, (newUser) => {
    if (newUser) {
      editForm.value.name = newUser.fullname
      
      if (newUser.birthday) {
        const bday = new Date(newUser.birthday)
        editForm.value.birthday = isNaN(bday.getTime()) ? null : bday
      } else {
        editForm.value.birthday = null
      }

      editForm.value.email = newUser.email || ''
      editForm.value.phone = newUser.phone
      editForm.value.gender = newUser.gender || 'Nam'
      avatarPreview.value = newUser.avatar || null
    }
  }, { immediate: true, deep: true })

  const onAvatarChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng chọn định dạng ảnh (jpg, png,...)', life: 3000 })
      return
    }

    // Validate file size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Kích thước ảnh không được vượt quá 5MB', life: 3000 })
      return
    }

    avatarFile.value = file
    avatarPreview.value = URL.createObjectURL(file)
  }

  const saveProfile = async () => {
    if (saving.value) return
    
    // Validation
    if (!editForm.value.name.trim()) {
       toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Họ tên không được để trống', life: 3000 })
       return
    }
    if (!editForm.value.phone.trim()) {
       toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Số điện thoại không được để trống', life: 3000 })
       return
    }
    if (!isValidPhone(editForm.value.phone)) {
       toast.add({ severity: 'error', summary: 'Lỗi', detail: PHONE_FORMAT_MESSAGE, life: 3000 })
       return
    }

    if (!editForm.value.birthday) {
       toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng chọn ngày sinh', life: 3000 })
       return
    }

    const birthDate = new Date(editForm.value.birthday)
    const age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      // Age check adjustment for precision
      if (age < 16) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Bạn phải đủ 16 tuổi trở lên', life: 3000 })
        return
      }
    } else if (age < 16) {
       toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Bạn phải đủ 16 tuổi trở lên', life: 3000 })
       return
    }
    
    if (age > 100) {
       toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Ngày sinh không hợp lệ (tối đa 100 tuổi)', life: 3000 })
       return
    }

    saving.value = true
    saveDone.value = false
    
    try {
      const formData = new FormData()
      formData.append('displayName', editForm.value.name)
      formData.append('phone', editForm.value.phone)
      if (editForm.value.birthday) {
        let bday = ''
        if (editForm.value.birthday instanceof Date) {
          const d = editForm.value.birthday
          bday = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        } else {
          bday = editForm.value.birthday
        }
        formData.append('birthday', bday)
      }
      formData.append('gender', editForm.value.gender)
      
      if (avatarFile.value) {
        formData.append('avatar', avatarFile.value)
      }

      const updatedUser = await userService.updateProfile(formData)
      authStore.setUserFromApi(updatedUser)
      
      saveDone.value = true
      toast.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật hồ sơ thành công', life: 3000 })
      
      setTimeout(() => {
        saveDone.value = false
      }, 2000)
    } catch (error: any) {
      toast.add({ severity: 'error', summary: 'Lỗi', detail: error.response?.data?.message || 'Có lỗi xảy ra', life: 3000 })
    } finally {
      saving.value = false
    }
  }

  const GENDER_OPTIONS = [
    { value: 'Nam', label: 'Nam' },
    { value: 'Nữ', label: 'Nữ' },
    { value: 'Khác', label: 'Khác' }
  ]

  const selectGender = (g: string) => {
    editForm.value.gender = g
  }

  return {
    user,
    isLoading,
    saving,
    saveDone,
    editForm,
    minDate,
    maxDate,
    formattedBirthday,
    avatarPreview,
    userInitial,
    onAvatarChange,
    saveProfile,
    selectGender,
    GENDER_OPTIONS
  }
}
