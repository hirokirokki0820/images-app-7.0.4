import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="images"
export default class extends Controller {
  static targets = ["upload", "preview", "image", "image_box"]

  connect() {
  }

  deleteImage(e){
    e.preventDefault()
    this.image_boxTarget.remove()
  }

  selectImages(){
    const files = this.uploadTargets[0].files
    for (let i = 0; i < files.length; i++) {
      this.uploadImage(files[i])
    }
    this.uploadTarget.value = ""
  }

  uploadImage(file){
    const csrfToken = document.getElementsByName('csrf-token')[0].content // CSRFトークンを取得
    const formData = new FormData()
    formData.append("image", file)
    const options = {
      method: 'POST',
      headers: {
        // 'Content-Type': 'multipart/form-data',
        'X-CSRF-Token': csrfToken
      },
      body: formData
    }
    fetch("/posts/upload_image", options)
      .then(response => response.json())
      .then(data => {
        this.previewImage(file, data.id)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  previewImage(file, image_id){
    const preview = this.previewTarget
    const fileReader = new FileReader()
    fileReader.onload = (function () {
      const img = new Image()
      const imgBox = document.createElement("div")
      const imgInnerBox = document.createElement("div")
      const deleteBtn = document.createElement("a")
      const hiddenField = document.createElement("input")
      // img_box.classList.add("inline-flex")
      imgBox.setAttribute("class", "inline-flex mx-1 mb-5")
      imgBox.setAttribute("data-controller", "images")
      imgBox.setAttribute("data-images-target", "image_box")
      imgInnerBox.setAttribute("class", "text-center")
      deleteBtn.setAttribute("class", "link cursor-pointer")
      deleteBtn.setAttribute("data-action", "click->images#deleteImage")
      deleteBtn.textContent = "削除"
      img.setAttribute("data-images-target", "image")
      hiddenField.setAttribute("name", "post[images][]")
      hiddenField.setAttribute("style", "none")
      hiddenField.setAttribute("type", "hidden")
      hiddenField.setAttribute("value", image_id)
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

  // uploadImages(file){
  //   // console.log(file)
  //   const csrfToken = document.getElementsByName('csrf-token')[0].content // CSRFトークンを取得
  //   const formData = new FormData()
  //   formData.append("image", file)
  //   // const contentLength = JSON.stringify(formData).length
  //   // console.log(formData.get("image"))
  //   const options = {
  //     method: 'POST',
  //     headers: {
  //       // 'Content-Type': 'multipart/form-data',
  //       'X-CSRF-Token': csrfToken
  //     },
  //     body: formData
  //   }
  //   fetch("/posts/upload_image", options)
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log(data.id)
  //       return data.id
  //     // this.image_idTarget.value = data.id
  //     })
  //     .catch((error) => {
  //       console.error(error)
  //     })
  // }

  // // showPreview(file){
  // //   fileReader.readAsDataURL(file)
  // // }

  // previewImages(){
  //   // e.preventDefault()
  //   const files = this.uploadTargets[0].files
  //   const preview = this.previewTarget
  //   for (let i = 0; i < files.length; i++) {
  //     const fileReader = new FileReader()
  //     fileReader.onload = (function () {
  //       const img = new Image()
  //       const imgBox = document.createElement("div")
  //       const imgInnerBox = document.createElement("div")
  //       const deleteBtn = document.createElement("a")
  //       const hiddenField = document.createElement("input")
  //       // img_box.classList.add("inline-flex")
  //       imgBox.setAttribute("class", "inline-flex mx-1 mb-5")
  //       imgBox.setAttribute("data-controller", "images")
  //       imgBox.setAttribute("data-images-target", "image_box")
  //       imgInnerBox.setAttribute("class", "text-center")
  //       deleteBtn.setAttribute("class", "link cursor-pointer")
  //       deleteBtn.setAttribute("data-action", "click->images#deleteImage")
  //       deleteBtn.textContent = "削除"
  //       img.setAttribute("data-images-target", "image")
  //       hiddenField.setAttribute("name", "post[images][]")
  //       hiddenField.setAttribute("style", "none")
  //       hiddenField.setAttribute("type", "hidden")
  //       hiddenField.setAttribute("data-images-target", "image_ids")
  //       imgBox.appendChild(imgInnerBox)
  //       imgInnerBox.appendChild(img)
  //       imgInnerBox.appendChild(deleteBtn)
  //       imgInnerBox.appendChild(hiddenField)
  //       img.src = this.result
  //       img.width = 100;
  //       preview.appendChild(imgBox)
  //     })
  //     this.uploadImages(files[i])
  //     // this.image_idTarget.value = data.id
  //     fileReader.readAsDataURL(files[i])
	//   }
  // }



}
