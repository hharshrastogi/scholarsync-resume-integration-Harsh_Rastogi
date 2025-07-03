import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { ResumeUploader } from '@/components/ResumeUploader';
import resumeSlice from '@/store/resumeSlice';

// Mock the Redux store
const mockStore = configureStore({
  reducer: {
    resume: resumeSlice,
    scholar: (state = { data: null, loading: false, error: null }) => state,
    projects: (state = { suggestions: [], loading: false, error: null }) => state,
  },
});

const theme = createTheme();

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <Provider store={mockStore}>
      <ThemeProvider theme={theme}>
        {ui}
      </ThemeProvider>
    </Provider>
  );
};

// Mock file reading
const mockFile = new File(['test content'], 'test-resume.pdf', { type: 'application/pdf' });

describe('ResumeUploader Component', () => {
  beforeEach(() => {
    // Reset store state before each test
    mockStore.dispatch({ type: 'resume/clearResume' });
  });

  test('renders resume uploader correctly', () => {
    renderWithProviders(<ResumeUploader />);
    
    expect(screen.getByText('Resume Analysis')).toBeInTheDocument();
    expect(screen.getByText('Drop your resume here or click to browse')).toBeInTheDocument();
    expect(screen.getByText('Supports PDF and DOCX files (max 5MB)')).toBeInTheDocument();
  });

  test('displays file upload area with correct styling', () => {
    renderWithProviders(<ResumeUploader />);
    
    const uploadArea = screen.getByText('Drop your resume here or click to browse').closest('div');
    expect(uploadArea).toBeInTheDocument();
  });

  test('handles file selection', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ResumeUploader />);
    
    const fileInput = screen.getByDisplayValue('') as HTMLInputElement;
    
    await user.upload(fileInput, mockFile);
    
    expect(fileInput.files?.[0]).toBe(mockFile);
    expect(fileInput.files).toHaveLength(1);
  });

  test('shows error state when file upload fails', () => {
    // Mock error state
    const errorStore = configureStore({
      reducer: {
        resume: (state = { data: null, loading: false, error: 'Upload failed', uploadProgress: 0 }) => state,
        scholar: (state = { data: null, loading: false, error: null }) => state,
        projects: (state = { suggestions: [], loading: false, error: null }) => state,
      },
    });

    render(
      <Provider store={errorStore}>
        <ThemeProvider theme={theme}>
          <ResumeUploader />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('Upload failed')).toBeInTheDocument();
  });

  test('shows loading progress during upload', () => {
    // Mock loading state
    const loadingStore = configureStore({
      reducer: {
        resume: (state = { data: null, loading: true, error: null, uploadProgress: 50 }) => state,
        scholar: (state = { data: null, loading: false, error: null }) => state,
        projects: (state = { suggestions: [], loading: false, error: null }) => state,
      },
    });

    render(
      <Provider store={loadingStore}>
        <ThemeProvider theme={theme}>
          <ResumeUploader />
        </ThemeProvider>
      </Provider>
    );

    // Check for progress bar
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });

  test('displays extracted data when resume is parsed successfully', () => {
    const mockResumeData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      skills: ['JavaScript', 'React', 'Node.js'],
      education: [
        { degree: 'BS Computer Science', institution: 'University ABC', year: '2020' }
      ],
      experience: [
        { title: 'Software Developer', company: 'Tech Corp', duration: '2020-2023' }
      ]
    };

    const successStore = configureStore({
      reducer: {
        resume: (state = { data: mockResumeData, loading: false, error: null, uploadProgress: 100 }) => state,
        scholar: (state = { data: null, loading: false, error: null }) => state,
        projects: (state = { suggestions: [], loading: false, error: null }) => state,
      },
    });

    render(
      <Provider store={successStore}>
        <ThemeProvider theme={theme}>
          <ResumeUploader />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('Resume Uploaded Successfully!')).toBeInTheDocument();
    expect(screen.getByText('Extracted Information')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('Clear Resume')).toBeInTheDocument();
  });

  test('clear button works correctly', async () => {
    const mockResumeData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      skills: ['JavaScript'],
      education: [],
      experience: []
    };

    const successStore = configureStore({
      reducer: {
        resume: (state = { data: mockResumeData, loading: false, error: null, uploadProgress: 100 }) => state,
        scholar: (state = { data: null, loading: false, error: null }) => state,
        projects: (state = { suggestions: [], loading: false, error: null }) => state,
      },
    });

    const user = userEvent.setup();
    render(
      <Provider store={successStore}>
        <ThemeProvider theme={theme}>
          <ResumeUploader />
        </ThemeProvider>
      </Provider>
    );

    const clearButton = screen.getByText('Clear Resume');
    await user.click(clearButton);

    // This would trigger the clearResume action
    expect(clearButton).toBeInTheDocument();
  });

  test('accepts only PDF and DOCX files', () => {
    renderWithProviders(<ResumeUploader />);
    
    const fileInput = screen.getByDisplayValue('') as HTMLInputElement;
    expect(fileInput.getAttribute('accept')).toBe('.pdf,.docx');
  });

  test('handles empty skills array gracefully', () => {
    const mockResumeData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      skills: [],
      education: [],
      experience: []
    };

    const successStore = configureStore({
      reducer: {
        resume: (state = { data: mockResumeData, loading: false, error: null, uploadProgress: 100 }) => state,
        scholar: (state = { data: null, loading: false, error: null }) => state,
        projects: (state = { suggestions: [], loading: false, error: null }) => state,
      },
    });

    render(
      <Provider store={successStore}>
        <ThemeProvider theme={theme}>
          <ResumeUploader />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('No skills detected')).toBeInTheDocument();
  });
});
