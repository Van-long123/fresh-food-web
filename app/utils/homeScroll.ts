export const getVisibleColumns = (): number => {
  if (window.matchMedia('(min-width: 1280px)').matches) return 5
  if (window.matchMedia('(min-width: 1024px)').matches) return 4
  if (window.matchMedia('(min-width: 640px)').matches) return 3

  return 2
}

export const getScrollStep = (element: HTMLElement): number => {
  const styles = window.getComputedStyle(element)
  const rawGap = styles.columnGap || styles.gap || '12'
  const gap = Number.parseFloat(rawGap) || 12
  const visibleColumns = getVisibleColumns()
  const columnWidth = (element.clientWidth - gap * (visibleColumns - 1)) / visibleColumns
  const stepColumns = Math.max(1, visibleColumns - 2)

  return (columnWidth + gap) * stepColumns
}
