import axios, { AxiosError, AxiosResponse } from "axios"
import { z } from "zod"

const client = axios.create({
  baseURL: "http://localhost:8000"
})

const getImages = async (title?: string): Promise<AxiosResponse | null> => {
  try {
    const params = title ? { title } : { }
    const response = await client.get("/api/images", { params })
    return response
  } catch (error) {
    return (error as AxiosError).response || null
  }
}

const ImageResponse = z.object({
  id: z.number(),
  title: z.string(),
  url: z.string()
}).array()

type ImageResponse = z.infer<typeof ImageResponse>

const validateImages = (response: AxiosResponse): ImageResponse | null => {
  const result = ImageResponse.safeParse(response.data)
  if (!result.success) {
    return null
  }
  return result.data
}

export const loadImages = async (title?: string) => {
  const response = await getImages(title)
  if (!response)
    return null
  if (response.status !== 200)
    return null
  const data = validateImages(response)
  if (!data)
    return null
  return data
}