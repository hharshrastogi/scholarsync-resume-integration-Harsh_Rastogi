import { configureStore } from '@reduxjs/toolkit';
import resumeReducer from './resumeSlice';
import scholarReducer from './scholarSlice';
import projectsReducer from './projectsSlice';

export const store = configureStore({
  reducer: {
    resume: resumeReducer,
    scholar: scholarReducer,
    projects: projectsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
