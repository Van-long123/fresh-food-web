import * as XLSX from 'xlsx'

/**
 * Xuất dữ liệu ra file Excel với nhiều sheet
 * sheetsData Object chứa data cho từng sheet: { [sheetName]: any[] }
 * fileName Tên file xuất ra (chưa kèm .xlsx) */
export const exportToExcel = (
  sheetsData: Record<string, any[]>,
  fileName: string = 'export_data'
) => {
  // Tạo workbook mới
  const workbook = XLSX.utils.book_new()

  // Lặp qua từng sheet data và thêm vào workbook
  for (const [sheetName, data] of Object.entries(sheetsData)) {
    // Convert JSON array sang worksheet
    const worksheet = XLSX.utils.json_to_sheet(data)
    
    // Set độ rộng cột mặc định (có thể điều chỉnh thêm nếu cần)
    const colWidths: { wch: number }[] = []
    if (data.length > 0) {
      Object.keys(data[0]).forEach((key) => {
        colWidths.push({ wch: Math.max(key.length, 15) }) // Độ rộng tối thiểu 15 ký tự
      })
      worksheet['!cols'] = colWidths
    }

    // Thêm sheet vào workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  }

  // Xuất file
  XLSX.writeFile(workbook, `${fileName}.xlsx`)
}
