import { useEffect, useState } from 'react'
import axios from 'axios'

const api_key = '9025ab9cfe910d43b57048c928562192'

const getPhotos = (page, text) =>
  axios.get(' https://www.flickr.com/services/rest/', {
    params: {
      method: 'flickr.photos.search',
      api_key,
      text,
      page,
      format: 'json',
      nojsoncallback: 'nojsoncallback'
    }
  })

export default function useSearchPhotos(page, text, setPage) {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getPhotos(page, text).then(({ data }) => {
      setLoading(false)
      if (data.stat === 'ok')
        setPhotos(photos => [...photos, ...data.photos.photo])
      else setPhotos([])
    })
  }, [page])

  useEffect(() => {
    setLoading(true)
    setPhotos([])
    setPage(1)
    getPhotos(page, text).then(({ data }) => {
      setLoading(false)
      if (data.stat === 'ok') setPhotos(data.photos.photo)
      else setPhotos([])
    })
  }, [text])

  if (!text) return { photos: [], loading }
  return { photos, loading }
}
