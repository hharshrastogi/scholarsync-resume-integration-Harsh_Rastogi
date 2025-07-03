import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface ScholarData {
  name: string;
  affiliation: string;
  researchInterests: string[];
  publications: Array<{
    title: string;
    authors: string;
    year: string;
    citations: number;
    venue: string;
  }>;
  totalCitations: number;
  hIndex: number;
  i10Index: number;
}

interface ScholarState {
  data: ScholarData | null;
  loading: boolean;
  error: string | null;
  profileUrl: string;
}

const initialState: ScholarState = {
  data: null,
  loading: false,
  error: null,
  profileUrl: '',
};

// Async thunk for Google Scholar profile fetching
export const fetchScholarProfile = createAsyncThunk(
  'scholar/fetchScholarProfile',
  async (profileUrl: string, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/fetch-scholar-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileUrl }),
      }); 

      if (!response.ok) {
        throw new Error('Failed to fetch Scholar profile');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const scholarSlice = createSlice({
  name: 'scholar',
  initialState,
  reducers: {
    clearScholarData: (state) => {
      state.data = null;
      state.error = null;
      state.profileUrl = '';
    },
    setProfileUrl: (state, action: PayloadAction<string>) => {
      state.profileUrl = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchScholarProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScholarProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchScholarProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearScholarData, setProfileUrl } = scholarSlice.actions;
export default scholarSlice.reducer;
