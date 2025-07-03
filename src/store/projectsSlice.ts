import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from './index';

export interface ProjectSuggestion {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  matchScore: number;
  tags: string[];
}

interface ProjectsState {
  suggestions: ProjectSuggestion[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  suggestions: [],
  loading: false,
  error: null,
};

// Async thunk for generating project suggestions
export const generateProjectSuggestions = createAsyncThunk(
  'projects/generateProjectSuggestions',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { resume, scholar } = state;

      if (!resume.data && !scholar.data) {
        throw new Error('No resume or scholar data available');
      }

      const response = await fetch('/api/generate-project-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData: resume.data,
          scholarData: scholar.data,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate project suggestions');
      }

      const data = await response.json();
      return data.suggestions;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearProjectSuggestions: (state) => {
      state.suggestions = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateProjectSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateProjectSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestions = action.payload;
      })
      .addCase(generateProjectSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProjectSuggestions } = projectsSlice.actions;
export default projectsSlice.reducer;
