console.log('halo 单文件上传')

const $ = document.querySelector

const dom = {
  uploadContainer: document.querySelector('.upload-container') as HTMLDivElement,
  uploadSelect: document.querySelector('.upload-select') as HTMLDivElement,
  fileInput: document.querySelector('#file-input') as HTMLInputElement,
  previewImg: document.querySelector('.preview-img') as HTMLImageElement,
}

const registerEvent = () => {
  dom.uploadSelect.addEventListener('click', () => {
    console.log('click upload-select,', dom.fileInput)
    dom.fileInput.click()
  })
  dom.fileInput.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) {
      return
    }
    console.log('file', file)
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
      upload(file)
      // console.log('fileReader.result', fileReader.result)
      console.log('dom.previewImg', dom.previewImg)
      dom.previewImg.src = fileReader.result as string
    }
  })
}

const setStatus = (status: 'select' | 'progress' | 'result') => {
  dom.uploadContainer.classList.remove('select', 'progress', 'result')
  dom.uploadContainer.classList.add(status)
}

const upload = (file: File) => {
  setStatus('progress')
  let p = 0
  dom.uploadContainer.style.setProperty('--upload-progress', String(p))
  const timer = setInterval(() => {
    if (p >= 100) {
      dom.uploadContainer.style.setProperty('--upload-progress', '100')
      setStatus('result')
      clearInterval(timer)
      return
    }
    p += 10
    dom.uploadContainer.style.setProperty('--upload-progress', String(p))
  }, 500)
}

const main = () => {
  registerEvent()
}

main()
