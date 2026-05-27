import { getAdminSettingsRequest, updateAdminSettingsRequest } from '~/api/admin/settingsApi'
import type { AdminSettings, AdminSettingsPayload } from '~/types/settings.type'

/**
 * Build FormData when logo is a File object, otherwise send plain JSON payload. */
const buildSettingsPayload = (payload: AdminSettingsPayload): FormData | AdminSettingsPayload => {
  if (payload.logo instanceof File) {
    const fd = new FormData()
    fd.append('websiteName', payload.websiteName ?? '')
    fd.append('phone', payload.phone ?? '')
    fd.append('email', payload.email ?? '')
    fd.append('address', payload.address ?? '')
    fd.append('copyright', payload.copyright ?? '')
    fd.append('logo', payload.logo, payload.logo.name)
    return fd
  }
  // No new file – send JSON (logo field carries the existing URL string)
  return payload
}

export const adminSettingsService = {
  get: (): Promise<AdminSettings> => getAdminSettingsRequest(),

  update: (payload: AdminSettingsPayload): Promise<AdminSettings> =>
    updateAdminSettingsRequest(buildSettingsPayload(payload))
}
