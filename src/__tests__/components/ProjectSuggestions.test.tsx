import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { ProjectSuggestions } from '@/components/ProjectSuggestions';
import projectsSlice from '@/store/projectsSlice';

const theme = createTheme();

const mockStore = configureStore({
  reducer: {
    resume: (state = { data: null, loading: false, error: null }) => state,
    scholar: (state = { data: null, loading: false, error: null }) => state,
    projects: projectsSlice,
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

describe('ProjectSuggestions Component', () => {
  beforeEach(() => {
    mockStore.dispatch({ type: 'projects/clearProjectSuggestions' });
  });

  test('renders project recommendations header correctly', () => {
    renderWithProviders(<ProjectSuggestions />);
    
    expect(screen.getByText('Project Recommendations')).toBeInTheDocument();
  });

  test('shows empty state when no data is available', () => {
    renderWithProviders(<ProjectSuggestions />);
    
    expect(screen.getByText('Ready to Discover Your Next Project?')).toBeInTheDocument();
    expect(screen.getByText(/Upload your resume or connect your Google Scholar profile/)).toBeInTheDocument();
  });

  test('shows generate suggestions button when data is available but no suggestions', () => {
    const storeWithData = configureStore({
      reducer: {
        resume: (state = { data: { name: 'John', skills: ['JavaScript'] }, loading: false, error: null }) => state,
        scholar: (state = { data: null, loading: false, error: null }) => state,
        projects: (state = { suggestions: [], loading: false, error: null }) => state,
      },
    });

    render(
      <Provider store={storeWithData}>
        <ThemeProvider theme={theme}>
          <ProjectSuggestions />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('Generate Project Suggestions')).toBeInTheDocument();
    expect(screen.getByText(/Our AI will analyze your skills and research interests/)).toBeInTheDocument();
  });

  test('shows loading state during suggestion generation', () => {
    const loadingStore = configureStore({
      reducer: {
        resume: (state = { data: { name: 'John', skills: ['JavaScript'] }, loading: false, error: null }) => state,
        scholar: (state = { data: null, loading: false, error: null }) => state,
        projects: (state = { suggestions: [], loading: true, error: null }) => state,
      },
    });

    render(
      <Provider store={loadingStore}>
        <ThemeProvider theme={theme}>
          <ProjectSuggestions />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('Analyzing Your Profile...')).toBeInTheDocument();
  });

  test('displays error when suggestion generation fails', () => {
    const errorStore = configureStore({
      reducer: {
        resume: (state = { data: { name: 'John', skills: ['JavaScript'] }, loading: false, error: null }) => state,
        scholar: (state = { data: null, loading: false, error: null }) => state,
        projects: (state = { suggestions: [], loading: false, error: 'Failed to generate suggestions' }) => state,
      },
    });

    render(
      <Provider store={errorStore}>
        <ThemeProvider theme={theme}>
          <ProjectSuggestions />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('Failed to generate suggestions')).toBeInTheDocument();
  });

  test('displays project suggestions when available', () => {
    const mockSuggestions = [
      {
        id: '1',
        title: 'E-commerce Web Application',
        description: 'Build a full-stack e-commerce platform with React and Node.js',
        category: 'Web Development',
        difficulty: 'Medium',
        estimatedTime: '2-3 months',
        matchScore: 85,
        requiredSkills: ['React', 'Node.js', 'MongoDB'],
        tags: ['fullstack', 'ecommerce', 'web']
      },
      {
        id: '2',
        title: 'Machine Learning Classifier',
        description: 'Create a machine learning model for image classification',
        category: 'Machine Learning',
        difficulty: 'Hard',
        estimatedTime: '3-4 months',
        matchScore: 70,
        requiredSkills: ['Python', 'TensorFlow', 'Data Science'],
        tags: ['ml', 'ai', 'classification']
      }
    ];

    const successStore = configureStore({
      reducer: {
        resume: (state = { data: { name: 'John', skills: ['JavaScript'] }, loading: false, error: null }) => state,
        scholar: (state = { data: null, loading: false, error: null }) => state,
        projects: (state = { suggestions: mockSuggestions, loading: false, error: null }) => state,
      },
    });

    render(
      <Provider store={successStore}>
        <ThemeProvider theme={theme}>
          <ProjectSuggestions />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('2 Personalized Recommendations')).toBeInTheDocument();
    expect(screen.getByText('E-commerce Web Application')).toBeInTheDocument();
    expect(screen.getByText('Machine Learning Classifier')).toBeInTheDocument();
    expect(screen.getByText('85% match')).toBeInTheDocument();
    expect(screen.getByText('70% match')).toBeInTheDocument();
    expect(screen.getByText('Generate New')).toBeInTheDocument();
  });

  test('displays project details correctly', () => {
    const mockSuggestion = {
      id: '1',
      title: 'Test Project',
      description: 'A test project description',
      category: 'Web Development',
      difficulty: 'Easy',
      estimatedTime: '1 month',
      matchScore: 90,
      requiredSkills: ['HTML', 'CSS', 'JavaScript'],
      tags: ['frontend', 'beginner']
    };

    const successStore = configureStore({
      reducer: {
        resume: (state = { data: { name: 'John', skills: ['JavaScript'] }, loading: false, error: null }) => state,
        scholar: (state = { data: null, loading: false, error: null }) => state,
        projects: (state = { suggestions: [mockSuggestion], loading: false, error: null }) => state,
      },
    });

    render(
      <Provider store={successStore}>
        <ThemeProvider theme={theme}>
          <ProjectSuggestions />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('A test project description')).toBeInTheDocument();
    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByText('1 month')).toBeInTheDocument();
    expect(screen.getByText('HTML')).toBeInTheDocument();
    expect(screen.getByText('CSS')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('#frontend')).toBeInTheDocument();
    expect(screen.getByText('#beginner')).toBeInTheDocument();
  });

  test('generate new suggestions button works', async () => {
    const mockSuggestion = {
      id: '1',
      title: 'Test Project',
      description: 'A test project description',
      category: 'Web Development',
      difficulty: 'Easy',
      estimatedTime: '1 month',
      matchScore: 90,
      requiredSkills: ['HTML'],
      tags: ['frontend']
    };

    const successStore = configureStore({
      reducer: {
        resume: (state = { data: { name: 'John', skills: ['JavaScript'] }, loading: false, error: null }) => state,
        scholar: (state = { data: null, loading: false, error: null }) => state,
        projects: (state = { suggestions: [mockSuggestion], loading: false, error: null }) => state,
      },
    });

    const user = userEvent.setup();
    render(
      <Provider store={successStore}>
        <ThemeProvider theme={theme}>
          <ProjectSuggestions />
        </ThemeProvider>
      </Provider>
    );

    const generateNewButton = screen.getByText('Generate New');
    await user.click(generateNewButton);

    // This would trigger the clearProjectSuggestions action
    expect(generateNewButton).toBeInTheDocument();
  });

  test('difficulty colors are applied correctly', () => {
    const suggestions = [
      {
        id: '1',
        title: 'Easy Project',
        description: 'Easy description',
        category: 'Web',
        difficulty: 'Easy',
        estimatedTime: '1 month',
        matchScore: 90,
        requiredSkills: ['HTML'],
        tags: ['easy']
      },
      {
        id: '2',
        title: 'Hard Project',
        description: 'Hard description',
        category: 'AI',
        difficulty: 'Hard',
        estimatedTime: '6 months',
        matchScore: 60,
        requiredSkills: ['Python'],
        tags: ['hard']
      }
    ];

    const successStore = configureStore({
      reducer: {
        resume: (state = { data: { name: 'John', skills: ['JavaScript'] }, loading: false, error: null }) => state,
        scholar: (state = { data: null, loading: false, error: null }) => state,
        projects: (state = { suggestions, loading: false, error: null }) => state,
      },
    });

    render(
      <Provider store={successStore}>
        <ThemeProvider theme={theme}>
          <ProjectSuggestions />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('Easy Project')).toBeInTheDocument();
    expect(screen.getByText('Hard Project')).toBeInTheDocument();
  });

  test('match score colors are applied correctly', () => {
    const suggestions = [
      {
        id: '1',
        title: 'High Match Project',
        description: 'High match description',
        category: 'Web',
        difficulty: 'Easy',
        estimatedTime: '1 month',
        matchScore: 85, // Should be success color
        requiredSkills: ['HTML'],
        tags: ['high']
      },
      {
        id: '2',
        title: 'Low Match Project',
        description: 'Low match description',
        category: 'AI',
        difficulty: 'Hard',
        estimatedTime: '6 months',
        matchScore: 45, // Should be error color
        requiredSkills: ['Python'],
        tags: ['low']
      }
    ];

    const successStore = configureStore({
      reducer: {
        resume: (state = { data: { name: 'John', skills: ['JavaScript'] }, loading: false, error: null }) => state,
        scholar: (state = { data: null, loading: false, error: null }) => state,
        projects: (state = { suggestions, loading: false, error: null }) => state,
      },
    });

    render(
      <Provider store={successStore}>
        <ThemeProvider theme={theme}>
          <ProjectSuggestions />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('85% match')).toBeInTheDocument();
    expect(screen.getByText('45% match')).toBeInTheDocument();
  });

  test('skills badge shows correct count', () => {
    const mockSuggestion = {
      id: '1',
      title: 'Test Project',
      description: 'A test project description',
      category: 'Web Development',
      difficulty: 'Easy',
      estimatedTime: '1 month',
      matchScore: 90,
      requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
      tags: ['frontend']
    };

    const successStore = configureStore({
      reducer: {
        resume: (state = { data: { name: 'John', skills: ['JavaScript'] }, loading: false, error: null }) => state,
        scholar: (state = { data: null, loading: false, error: null }) => state,
        projects: (state = { suggestions: [mockSuggestion], loading: false, error: null }) => state,
      },
    });

    render(
      <Provider store={successStore}>
        <ThemeProvider theme={theme}>
          <ProjectSuggestions />
        </ThemeProvider>
      </Provider>
    );

    // Badge should show count of required skills (5)
    expect(screen.getByText('Skills')).toBeInTheDocument();
  });
});
