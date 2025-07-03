"use client";

import React, { useRef } from "react";
import { parseResume, setUploadProgress, clearResume } from "@/store/resumeSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
  Paper
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

export const ResumeUploader = () => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { error, uploadProgress, data } = useAppSelector((state) => state.resume);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      dispatch(setUploadProgress(0));
      await dispatch(parseResume(file));
    }
  };

  const handleClear = () => {
    dispatch(clearResume());
    if (fileInputRef.current) fileInputRef.current.value = "";
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
        <DescriptionIcon color="primary" />
        Resume Analysis
      </Typography>
      
      <Paper
        sx={{
          border: 2,
          borderStyle: 'dashed',
          borderColor: data ? 'success.main' : 'primary.main',
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: data ? 'success.dark' : 'primary.dark',
            bgcolor: 'grey.50'
          }
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <Box sx={{ pointerEvents: 'none' }}>
          {data ? (
            <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
          ) : (
            <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          )}
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            {data ? 'Resume Uploaded Successfully!' : 'Drop your resume here or click to browse'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Supports PDF and DOCX files (max 5MB)
          </Typography>
        </Box>
      </Paper>
      
      {uploadProgress > 0 && uploadProgress < 100 && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} sx={{ height: 8, borderRadius: 4 }} />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      
      {data && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon color="success" />
            Extracted Information
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Personal Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2">
                      <strong>Name:</strong> {data.name || 'Not found'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email:</strong> {data.email || 'Not found'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Phone:</strong> {data.phone || 'Not found'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Skills Identified
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {data.skills.length > 0 ? (
                      data.skills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No skills detected
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Education
                  </Typography>
                  {data.education.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {data.education.map((edu, index) => (
                        <Box key={index}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {edu.degree}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {edu.institution} • {edu.year}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No education found
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Experience
                  </Typography>
                  {data.experience.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {data.experience.map((exp, index) => (
                        <Box key={index}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {exp.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {exp.company} • {exp.duration}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No experience found
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={handleClear}
              startIcon={<DeleteIcon />}
              color="error"
              variant="outlined"
            >
              Clear Resume
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

