import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
}

interface ResumeState {
  data: ResumeData | null;
  loading: boolean;
  error: string | null;
  uploadProgress: number;
}

const initialState: ResumeState = {
  data: null,
  loading: false,
  error: null,
  uploadProgress: 0,
};

// Async thunk for resume parsing
export const parseResume = createAsyncThunk(
  'resume/parseResume',
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to parse resume');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    clearResume: (state) => {
      state.data = null;
      state.error = null;
      state.uploadProgress = 0;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(parseResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(parseResume.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.uploadProgress = 100;
      })
      .addCase(parseResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.uploadProgress = 0;
      });
  },
});

export const { clearResume, setUploadProgress } = resumeSlice.actions;
export default resumeSlice.reducer;
