export const getBase64 = (img: any, callback: (data: string | ArrayBuffer | null) => void) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
    reader.removeEventListener('load', () => callback(reader.result))
}