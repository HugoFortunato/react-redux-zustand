import { useAppSelector } from "../store"

export const useCurrentLesson = () => {
    return useAppSelector(state => {
        const { currentModuleIndex, currentLessonIndex } = state.player

        const currentModule = state.player.course?.modules[currentModuleIndex]
        const currentLesson = currentModule?.lessons[currentLessonIndex]

        return { currentModule, currentLesson }
    })
}
