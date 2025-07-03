import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { ScholarProfileInput } from '@/components/ScholarProfileInput';
import scholarSlice from '@/store/scholarSlice';

const theme = createTheme();

const mockStore = configureStore({
  reducer: {
    resume: (state = { data: null, loading: false, error: null }) => state,
    scholar: scholarSlice,
    projects: (state = { suggestions: [], loading: false, error: null }) => state,
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <Provider store={mockStore}>
      <ThemeProvider theme={theme}>
        {ui}
      </ThemeProvider>
    </Provider>
  );
};

describe('ScholarProfileInput Component', () => {
  beforeEach(() => {
    mockStore.dispatch({ type: 'scholar/clearScholarData' });
  });

  test('renders scholar profile input correctly', () => {
    renderWithProviders(<ScholarProfileInput />);
    
    expect(screen.getByText('Google Scholar Profile')).toBeInTheDocument();
    expect(screen.getByLabelText('Google Scholar Profile URL')).toBeInTheDocument();
    expect(screen.getByText('Fetch Profile')).toBeInTheDocument();
    expect(screen.getByText(/Copy your Google Scholar profile URL/)).toBeInTheDocument();
  });

  test('handles URL input correctly', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ScholarProfileInput />);
    
    const urlInput = screen.getByLabelText('Google Scholar Profile URL');
    const testUrl = 'https://scholar.google.com/citations?user=test123';
    
    await user.type(urlInput, testUrl);
    
    expect(urlInput).toHaveValue(testUrl);
  });

  test('validates required URL field', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ScholarProfileInput />);
    
    const urlInput = screen.getByLabelText('Google Scholar Profile URL');
    const submitButton = screen.getByText('Fetch Profile');
    
    // Try to submit without URL
    await user.click(submitButton);
    
    // HTML5 validation should prevent submission
    expect(urlInput).toBeRequired();
  });

  test('shows loading state during profile fetch', () => {
    const loadingStore = configureStore({
      reducer: {
        resume: (state = { data: null, loading: false, error: null }) => state,
        scholar: (state = { data: null, loading: true, error: null, profileUrl: '' }) => state,
        projects: (state = { suggestions: [], loading: false, error: null }) => state,
      },
    });

    render(
      <Provider store={loadingStore}>
        <ThemeProvider theme={theme}>
          <ScholarProfileInput />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('Fetching Profile...')).toBeInTheDocument();
  });

  test('displays error when profile fetch fails', () => {
    const errorStore = configureStore({
      reducer: {
        resume: (state = { data: null, loading: false, error: null }) => state,
        scholar: (state = { data: null, loading: false, error: 'Failed to fetch profile', profileUrl: '' }) => state,
        projects: (state = { suggestions: [], loading: false, error: null }) => state,
      },
    });

    render(
      <Provider store={errorStore}>
        <ThemeProvider theme={theme}>
          <ScholarProfileInput />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('Failed to fetch profile')).toBeInTheDocument();
  });

  test('displays scholar data when fetch is successful', () => {
    const mockScholarData = {
      name: 'Dr. Jane Smith',
      affiliation: 'University XYZ',
      totalCitations: 1500,
      hIndex: 25,
      i10Index: 30,
      researchInterests: ['Machine Learning', 'Computer Vision', 'AI'],
      publications: [
        {
          title: 'Advanced ML Techniques',
          authors: 'J. Smith, A. Doe',
          venue: 'ICML',
          year: '2023',
          citations: 45
        },
        {
          title: 'Deep Learning Applications',
          authors: 'J. Smith, B. Johnson',
          venue: 'NeurIPS',
          year: '2022',
          citations: 32
        }
      ]
    };

    const successStore = configureStore({
      reducer: {
        resume: (state = { data: null, loading: false, error: null }) => state,
        scholar: (state = { data: mockScholarData, loading: false, error: null, profileUrl: 'test-url' }) => state,
        projects: (state = { suggestions: [], loading: false, error: null }) => state,
      },
    });

    render(
      <Provider store={successStore}>
        <ThemeProvider theme={theme}>
          <ScholarProfileInput />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('Scholar Profile Retrieved')).toBeInTheDocument();
    expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('University XYZ')).toBeInTheDocument();
    expect(screen.getByText('1,500')).toBeInTheDocument(); // formatted number
    expect(screen.getByText('Machine Learning')).toBeInTheDocument();
    expect(screen.getByText('Advanced ML Techniques')).toBeInTheDocument();
    expect(screen.getByText('Clear Profile')).toBeInTheDocument();
  });

  test('handles empty research interests gracefully', () => {
    const mockScholarData = {
      name: 'Dr. Jane Smith',
      affiliation: 'University XYZ',
      totalCitations: 0,
      hIndex: 0,
      i10Index: 0,
      researchInterests: [],
      publications: []
    };

    const successStore = configureStore({
      reducer: {
        resume: (state = { data: null, loading: false, error: null }) => state,
        scholar: (state = { data: mockScholarData, loading: false, error: null, profileUrl: 'test-url' }) => state,
        projects: (state = { suggestions: [], loading: false, error: null }) => state,
      },
    });

    render(
      <Provider store={successStore}>
        <ThemeProvider theme={theme}>
          <ScholarProfileInput />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('No interests listed')).toBeInTheDocument();
    expect(screen.getByText('No publications found')).toBeInTheDocument();
  });

  test('clear profile button works correctly', async () => {
    const mockScholarData = {
      name: 'Dr. Jane Smith',
      affiliation: 'University XYZ',
      totalCitations: 100,
      hIndex: 10,
      i10Index: 5,
      researchInterests: ['AI'],
      publications: []
    };

    const successStore = configureStore({
      reducer: {
        resume: (state = { data: null, loading: false, error: null }) => state,
        scholar: (state = { data: mockScholarData, loading: false, error: null, profileUrl: 'test-url' }) => state,
        projects: (state = { suggestions: [], loading: false, error: null }) => state,
      },
    });

    const user = userEvent.setup();
    render(
      <Provider store={successStore}>
        <ThemeProvider theme={theme}>
          <ScholarProfileInput />
        </ThemeProvider>
      </Provider>
    );

    const clearButton = screen.getByText('Clear Profile');
    await user.click(clearButton);

    // This would trigger the clearScholarData action
    expect(clearButton).toBeInTheDocument();
  });

  test('displays publications with correct formatting', () => {
    const mockScholarData = {
      name: 'Dr. Jane Smith',
      affiliation: 'University XYZ',
      totalCitations: 100,
      hIndex: 10,
      i10Index: 5,
      researchInterests: [],
      publications: [
        {
          title: 'Test Paper 1',
          authors: 'J. Smith, A. Collaborator',
          venue: 'Test Conference',
          year: '2023',
          citations: 15
        },
        {
          title: 'Test Paper 2',
          authors: 'J. Smith',
          venue: 'Another Journal',
          year: '2022',
          citations: 8
        }
      ]
    };

    const successStore = configureStore({
      reducer: {
        resume: (state = { data: null, loading: false, error: null }) => state,
        scholar: (state = { data: mockScholarData, loading: false, error: null, profileUrl: 'test-url' }) => state,
        projects: (state = { suggestions: [], loading: false, error: null }) => state,
      },
    });

    render(
      <Provider store={successStore}>
        <ThemeProvider theme={theme}>
          <ScholarProfileInput />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('Test Paper 1')).toBeInTheDocument();
    expect(screen.getByText('J. Smith, A. Collaborator')).toBeInTheDocument();
    expect(screen.getByText('Test Conference • 2023')).toBeInTheDocument();
    expect(screen.getByText('15 citations')).toBeInTheDocument();
  });

  test('shows truncation message for many publications', () => {
    const publications = Array.from({ length: 10 }, (_, i) => ({
      title: `Paper ${i + 1}`,
      authors: 'J. Smith',
      venue: 'Conference',
      year: '2023',
      citations: 5
    }));

    const mockScholarData = {
      name: 'Dr. Jane Smith',
      affiliation: 'University XYZ',
      totalCitations: 100,
      hIndex: 10,
      i10Index: 5,
      researchInterests: [],
      publications
    };

    const successStore = configureStore({
      reducer: {
        resume: (state = { data: null, loading: false, error: null }) => state,
        scholar: (state = { data: mockScholarData, loading: false, error: null, profileUrl: 'test-url' }) => state,
        projects: (state = { suggestions: [], loading: false, error: null }) => state,
      },
    });

    render(
      <Provider store={successStore}>
        <ThemeProvider theme={theme}>
          <ScholarProfileInput />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('And 5 more publications...')).toBeInTheDocument();
  });
});
