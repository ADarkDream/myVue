import hljs from "highlight.js/lib/common"
import "highlight.js/styles/default.css" // 选择你喜欢的代码高亮样式
//utils
import myFunction from "@/utils/myFunction"
import { ElMessage } from "element-plus"

const { copyCode } = myFunction
const copy = (text: string) => {
  const textarea = document.createElement("textarea")
  textarea.value = text
  copyCode(text, "代码")
}

export default {
  update(el) {
    const blocks = el.querySelectorAll("pre code")
    blocks.forEach((block) => {
      if (block.getAttribute("highlighted") === "true") {
        return
      }
      block.setAttribute("highlighted", "true")
      const code = block.innerHTML

      hljs.highlightElement(block)

      // 添加行号
      block.innerHTML = `
        <div>
          <div style='padding: 5px 0px 10px 20px'>
            <span style='margin-right: 10px; padding: 5px; border: rgba(16, 125, 237,0.5) solid 1px; color: #107ded; border-radius: 5px'>
              ${block.className.match(/(?<=language-).*(?= hljs)/).toString()}
            </span>
            <button class='el-button el-button--default el-button--mini' style='border-radius: 5px'>复制</button>
          </div>
          ${block.innerHTML}
        </div>`

      const copyButton = block.querySelector("button")
      if (copyButton !== null) {
        copyButton.onclick = function () {
          copy(code)
          // 使用 Element Plus 的消息组件
          if (typeof ElMessage !== "undefined") {
            ElMessage.success({ message: "复制成功！", offset: 100 })
          } else {
            alert("复制成功！")
          }
        }
      }
    })
  },
}
