"use client";

import React from "react";
import { generateProjectSuggestions, clearProjectSuggestions } from "@/store/projectsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  Box,
  Typography,
  Button,
  Alert,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Divider,
  Badge,
  Avatar
} from '@mui/material';
import {
  Rocket as RocketIcon,
  AutoAwesome as AutoAwesomeIcon,
  Refresh as RefreshIcon,
  Schedule as ScheduleIcon,
  Category as CategoryIcon,
  Speed as SpeedIcon,
  Construction as ConstructionIcon,
  Stars as StarsIcon
} from '@mui/icons-material';

export const ProjectSuggestions = () => {
  const dispatch = useAppDispatch();
  const { suggestions, loading, error } = useAppSelector((state) => state.projects);
  const { data: resumeData } = useAppSelector((state) => state.resume);
  const { data: scholarData } = useAppSelector((state) => state.scholar);

  const handleGenerateSuggestions = async () => {
    await dispatch(generateProjectSuggestions());
  };

  const handleClear = () => {
    dispatch(clearProjectSuggestions());
  };

  // Check if we have data to generate suggestions
  const hasData = resumeData || scholarData;

  const getMatchScoreColor = (score: number): 'success' | 'warning' | 'error' => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getDifficultyColor = (difficulty: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 3, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          fontWeight: 600
        }}
      >
        <RocketIcon color="primary" />
        Project Recommendations
      </Typography>
      
      {!hasData && (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <Avatar sx={{ fontSize: '4rem', width: 80, height: 80, mx: 'auto', mb: 3, bgcolor: 'primary.light' }}>
              🎯
            </Avatar>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Ready to Discover Your Next Project?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', lineHeight: 1.6 }}>
              Upload your resume or connect your Google Scholar profile to receive 
              personalized project recommendations tailored to your expertise.
            </Typography>
          </CardContent>
        </Card>
      )}
      
      {hasData && suggestions.length === 0 && (
        <Card sx={{ textAlign: 'center', py: 4 }}>
          <CardContent>
            <Button 
              onClick={handleGenerateSuggestions} 
              disabled={loading}
              variant="contained"
              size="large"
              startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
              sx={{ mb: 2 }}
            >
              {loading ? 'Analyzing Your Profile...' : 'Generate Project Suggestions'}
            </Button>
            <Typography variant="body2" color="text.secondary">
              Our AI will analyze your skills and research interests to suggest relevant projects
            </Typography>
          </CardContent>
        </Card>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {suggestions.length > 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StarsIcon color="primary" />
              {suggestions.length} Personalized Recommendations
            </Typography>
            <Button 
              onClick={handleClear} 
              startIcon={<RefreshIcon />}
              variant="outlined"
              size="small"
            >
              Generate New
            </Button>
          </Box>
          
          <Stack spacing={3}>
            {suggestions.map((project) => (
              <Card 
                key={project.id} 
                sx={{ 
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, flex: 1, mr: 2 }}>
                      {project.title}
                    </Typography>
                    <Chip
                      label={`${project.matchScore}% match`}
                      color={getMatchScoreColor(project.matchScore)}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                    {project.description}
                  </Typography>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CategoryIcon fontSize="small" color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Category</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{project.category}</Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SpeedIcon fontSize="small" color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Difficulty</Typography>
                        <Chip
                          label={project.difficulty}
                          color={getDifficultyColor(project.difficulty)}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <ConstructionIcon fontSize="small" color="action" />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="caption" color="text.secondary">Skills Needed</Typography>
                      <Chip
                        label={`${project.requiredSkills.length} Skills`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      Required Skills
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {project.requiredSkills.map((skill, skillIndex) => (
                        <Chip
                          key={skillIndex}
                          label={skill}
                          variant="outlined"
                          size="small"
                          color="primary"
                        />
                      ))}
                    </Box>
                  </Box>
                  
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      Tags
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {project.tags.map((tag, tagIndex) => (
                        <Chip
                          key={tagIndex}
                          label={`#${tag}`}
                          variant="filled"
                          size="small"
                          color="secondary"
                        />
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button 
              onClick={handleGenerateSuggestions} 
              disabled={loading}
              variant="outlined"
              startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
            >
              {loading ? 'Regenerating...' : 'Generate New Suggestions'}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};
