//文件处理的方法
import * as XLSX from "xlsx" // 导入 xlsx
import { saveAs } from "file-saver"

export default {
  /**
   * 生成Excel文件并保存
   * @param sheetData - 要导出的数据
   * @param bookName - 工作簿名称
   * @param fileName - 文件名称
   * */
  save_as_excel: (sheetData: Array<Array<any>>, bookName: string, fileName: string) => {
    // 转换为工作表
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData)

    // 创建工作簿
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, bookName)

    // 导出 Excel
    // XLSX.writeFile(workbook, fileName +".xlsx") // 可以直接保存，但saveAs兼容更好
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    })
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" })
    saveAs(blob, fileName + ".xlsx")
  },
}
