import { Axios } from 'src/api/axios'

export const uploadFile = async (data: FormData) => {
  const request = {
    method: 'POST',
    url: `/api/gcp/storage/upload`,
    options: { contentType: 'multipart/form-data' },
    data
  }

  return await Axios(request)
}
type DeleteFileType = {
  bucketName: string
  fileName: string
}

export const deleteFile = async (data: DeleteFileType) => {
  const request = {
    method: 'DELETE',
    url: `/api/gcp/storage/delete`,
    data
  }

  return await Axios(request)
}
