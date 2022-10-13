import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="images"
export default class extends Controller {
  static targets = ["select", "preview", "image", "image_box"]

  deleteImage(){
    this.image_boxTarget.remove()
  }

  /* 画像選択時の処理 */
  selectImages(){
    const files = this.selectTargets[0].files
    for(const file of files){
      this.uploadImage(file) // ファイルのアップロード
    }
    this.selectTarget.value = "" // 選択ファイルのリセット
  }

  /* 画像アップロード */
  uploadImage(file){
    const csrfToken = document.getElementsByName('csrf-token')[0].content // CSRFトークンを取得
    const formData = new FormData()
    formData.append("image", file) // formDataオブジェクトに画像ファイルをセット
    const options = {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrfToken
      },
      body: formData
    }
    fetch("/posts/upload_image", options) // 画像ファイルをコントローラーに送信
      .then(response => response.json())
      .then(data => { // コントローラーからのレスポンス(id含む)
        this.previewImage(file, data.id) // 画像プレビュー時にidを受け渡す
      })
      .catch((error) => {
        console.error(error)
      })
  }

  /* 画像プレビュー */
  previewImage(file, image_id){
    const preview = this.previewTarget
    const fileReader = new FileReader()
    const setAttr = (element, obj)=>{ // 属性設定用の関数
      Object.keys(obj).forEach((key)=>{
        element.setAttribute(key, obj[key])
      })
    }
    fileReader.onload = (function () { // ファイル読み込み時の処理
      const img = new Image()
      const imgBox = document.createElement("div")
      const imgInnerBox = document.createElement("div")
      const deleteBtn = document.createElement("a")
      const hiddenField = document.createElement("input")
      const imgAttr = { // imgに設定する属性
        "data-images-target" : "image"
      }
      const imgBoxAttr = { // imgBoxに設定する属性
        "class" : "inline-flex mx-1 mb-5",
        "data-controller" : "images",
        "data-images-target" : "image_box",
      }
      const imgInnerBoxAttr = { // imgInnerBoxに設定する属性
        "class" : "text-center"
      }
      const deleteBtnAttr = { // deleteBtnに設定する属性
        "class" : "link cursor-pointer",
        "data-action" : "click->images#deleteImage"
      }
      const hiddenFieldAttr = { // hiddenFieldに設定する属性
        "name" : "post[images][]",
        "style" : "none",
        "type" : "hidden",
        "value" : image_id,
      }
      setAttr(img, imgAttr)
      setAttr(imgBox, imgBoxAttr)
      setAttr(imgInnerBox, imgInnerBoxAttr)
      setAttr(deleteBtn, deleteBtnAttr)
      setAttr(hiddenField, hiddenFieldAttr)

      deleteBtn.textContent = "削除"

      imgBox.appendChild(imgInnerBox)
      imgInnerBox.appendChild(img)
      imgInnerBox.appendChild(deleteBtn)
      imgInnerBox.appendChild(hiddenField)
      img.src = this.result
      img.width = 100;

      preview.appendChild(imgBox)
    })
    fileReader.readAsDataURL(file)
  }

}
