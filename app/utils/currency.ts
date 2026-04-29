export const formatVnd = (value: number): string => {
  const normalized = typeof value === 'number' && Number.isFinite(value) ? value : 0
  return normalized.toLocaleString('vi-VN')
}
