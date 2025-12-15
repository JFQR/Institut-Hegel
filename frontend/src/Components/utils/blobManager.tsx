/*
 * file to b64. I'm using this to add the img in localstorage
 * the fileToBase64 converts the img and placeImg
 * places it in localstorage
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      resolve(reader.result as string)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function placeImg(file:File){
  const base64String = await fileToBase64(file)
  localStorage.setItem("userProfileImage", base64String)
}