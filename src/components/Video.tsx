import ReactPlayer from 'react-player'
import { useAppSelector, useAppDispatch } from '../store'
import { next } from '../store/slices/player'
import { Loader } from 'lucide-react'

export function Video() {
  const dispatch = useAppDispatch()
  const isCourseLoading = useAppSelector((state) => state.player.isLoading)
  const lesson = useAppSelector((state) => {
    const { currentModuleIndex, currentLessonIndex } = state.player

    const currentLesson =
      state?.player?.course?.modules[currentModuleIndex].lessons[
        currentLessonIndex
      ]

    return currentLesson
  })

  function handlePlayNext() {
    dispatch(next())
  }

  return (
    <div className="w-full bg-zinc-950 aspect-video">
      {isCourseLoading ? (
        <div className="flex h-full items-center justify-center">
          <Loader className="w-6 h-6 text-zinc-400 animate-spin" />
        </div>
      ) : (
        <ReactPlayer
          width="100%"
          height="100%"
          controls
          playing
          onEnded={handlePlayNext}
          url={`https://www.youtube.com/watch?v=${lesson?.id}`}
        />
      )}
    </div>
  )
}
