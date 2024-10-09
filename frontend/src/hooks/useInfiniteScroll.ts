import { useEffect, useRef } from 'react'

const useInfiniteScroll = (
  loading: boolean,
  hasMore: boolean,
  setPage: React.Dispatch<React.SetStateAction<number>>
) => {
  const observer = useRef<IntersectionObserver | null>(null)

  const lastStudentRef = (node: HTMLDivElement | null) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage: number) => prevPage + 1)
      }
    })

    if (node) observer.current.observe(node)
  }

  return lastStudentRef
}

export default useInfiniteScroll
