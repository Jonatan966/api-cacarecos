
import { v2 as cloudinary } from 'cloudinary'
import { v4 as generateUUID } from 'uuid'

import { wait } from '@utils/wait'

const WORKFOLDER = 'cacarecos'

interface ImageItem {
  url: string;
  id: string;
}

export const ImageUploadProvider = {
  async uploadOne (entityId: string, imagePath: string) {
    const finalImagePath = `${WORKFOLDER}/${entityId}/${generateUUID()}`

    try {
      await wait(500)

      const uploadResponse = await cloudinary.uploader.upload(imagePath, {
        public_id: finalImagePath
      })

      return {
        url: uploadResponse.secure_url,
        id: uploadResponse.public_id
      }
    } catch {
      return null
    }
  },

  async uploadMany (entityId: string, imagePaths: string[]) {
    const finalResponse = []

    for (const imagePath of imagePaths) {
      const uploadResponse = await ImageUploadProvider.uploadOne(entityId, imagePath)

      if (uploadResponse) {
        finalResponse.push(uploadResponse)
        continue
      }

      finalResponse.push({
        failed: imagePath
      })
    }

    return finalResponse
  },

  async getImages (entityId: string): Promise<ImageItem[]> {
    try {
      const searchResponse = await cloudinary.search
        .expression(`folder:${WORKFOLDER}/${entityId}`)
        .execute()

      await wait(searchResponse.rate_limit_allowed)

      const finalSearchResponse = searchResponse.resources.map(resource => ({
        url: resource.secure_url,
        id: resource.public_id
      }))

      return finalSearchResponse
    } catch {
      return []
    }
  },

  async removeImage (imageId: string) {
    const removeResponse = await cloudinary.uploader.destroy(imageId)

    await wait(500)

    return removeResponse.result === 'ok'
  },

  async removeAll (entityId: string) {
    try {
      const imageList = await ImageUploadProvider.getImages(entityId)

      for (const image of imageList) {
        await ImageUploadProvider.removeImage(image.id)
      }

      await cloudinary.api.delete_folder(`${WORKFOLDER}/${entityId}`)

      return true
    } catch {
      return false
    }
  }
}
