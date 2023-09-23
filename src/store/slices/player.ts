import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../lib/axios";
interface Course {
    id: number
    modules: Array<{
        id: number
        title: string
        lessons: Array<{
            id: string
            title: string
            duration: string
        }>
    }>
}

export interface PlayerState {
    course: Course | null;
    list: Array<{
        id: number
        title: string
    }>;
    currentModuleIndex: number;
    currentLessonIndex: number;
    isLoading: boolean
}

const initialState: PlayerState = {
    course: null,
    list: [],
    currentModuleIndex: 0,
    currentLessonIndex: 0,
    isLoading: false
}

export const loadCourse = createAsyncThunk(
    'player/load',
    async () => {
        const response = await api.get('/courses/1/')

        return response.data
    }
)

export const deleteLesson = createAsyncThunk(
    'player/deleteLesson',
    async (moduleIndex: number) => {
        const response = await api.delete(`/courses/${moduleIndex}`);

        return response.data;
    }
);

export const loadList = createAsyncThunk(
    'player/list/load',
    async () => {
        const response = await api.get('/list')

        return response.data
    }
)

export const deleteListItem = createAsyncThunk(
    'player/list/delete',
    async (listIndex: number) => {
        const response = await api.delete(`/list/${listIndex}`);

        return response.data;
    }
);


const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        play: (state, action: PayloadAction<[number, number]>) => {
            state.currentModuleIndex = action.payload[0]
            state.currentLessonIndex = action.payload[1]
        },
        next: (state) => {
            const nextLessonIndex = state.currentLessonIndex + 1;
            const nextLesson = state.course?.modules[state.currentModuleIndex].lessons[nextLessonIndex];

            if (nextLesson) {
                state.currentLessonIndex = nextLessonIndex;
            } else {
                const nextModuleIndex = state.currentModuleIndex + 1;
                const nextModule = state.course?.modules[nextModuleIndex];

                if (nextModule) {
                    state.currentModuleIndex = nextModuleIndex;
                    state.currentLessonIndex = 0;
                }
            }
        },
    },
    extraReducers(builder) {
        builder.addCase(loadCourse.pending, (state) => {
            state.isLoading = true
        })
        builder.addCase(loadCourse.fulfilled, (state, action) => {
            state.course = action.payload,
                state.isLoading = false
        })
        builder.addCase(loadList.fulfilled, (state, action) => {
            state.list = action.payload,
                state.isLoading = false
        })
        builder.addCase(deleteListItem.fulfilled, (state, action) => {
            state.list = action.payload,
                state.isLoading = false
        })

        // builder.addCase(deleteLesson.fulfilled, (state, action) => {
        //     console.log('cheguei')
        //     state.course = action.payload
        // })

    }
})

export const player = playerSlice.reducer;
export const { play, next } = playerSlice.actions;
