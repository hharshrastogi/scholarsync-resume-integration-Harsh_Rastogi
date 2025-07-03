"use client";

import React, { useState } from "react";
import { fetchScholarProfile, setProfileUrl, clearScholarData } from "@/store/scholarSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Badge
} from '@mui/material';
import {
  School as SchoolIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Book as BookIcon,
  Person as PersonIcon
} from '@mui/icons-material';

export const ScholarProfileInput = () => {
  const dispatch = useAppDispatch();
  const [url, setUrl] = useState("");
  const { loading, error, data } = useAppSelector((state) => state.scholar);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      dispatch(setProfileUrl(url));
      await dispatch(fetchScholarProfile(url));
    }
  };

  const handleClear = () => {
    dispatch(clearScholarData());
    setUrl("");
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
        <SchoolIcon color="primary" />
        Google Scholar Profile
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://scholar.google.com/citations?user=..."
          label="Google Scholar Profile URL"
          variant="outlined"
          required
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: <SchoolIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
        <Button 
          type="submit" 
          disabled={loading}
          variant="contained"
          size="large"
          startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
          sx={{ mb: 2 }}
        >
          {loading ? 'Fetching Profile...' : 'Fetch Profile'}
        </Button>
      </Box>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Tip:</strong> Copy your Google Scholar profile URL from your browser&apos;s address bar
        </Typography>
      </Alert>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {data && (
        <Box>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 3, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: 'success.main'
            }}
          >
            <CheckCircleIcon color="success" />
            Scholar Profile Retrieved
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon color="primary" />
                    Profile Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Typography variant="body2">
                      <strong>Name:</strong> {data.name}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Affiliation:</strong> {data.affiliation}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Total Citations:</strong> {data.totalCitations.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>H-Index:</strong> {data.hIndex}
                    </Typography>
                    <Typography variant="body2">
                      <strong>i10-Index:</strong> {data.i10Index}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUpIcon color="primary" />
                    Research Interests
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {data.researchInterests.length > 0 ? (
                      data.researchInterests.map((interest, index) => (
                        <Chip
                          key={index}
                          label={interest}
                          color="secondary"
                          variant="outlined"
                          size="small"
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No interests listed
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <BookIcon color="primary" />
                Recent Publications
                <Badge badgeContent={data.publications.length} color="primary" />
              </Typography>
              {data.publications.length > 0 ? (
                <List>
                  {data.publications.slice(0, 5).map((pub, index) => (
                    <Box key={index}>
                      <ListItem sx={{ px: 0, py: 2 }}>
                        <ListItemText
                          primary={
                            <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {pub.title}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                {pub.authors}
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="caption" color="text.secondary">
                                  {pub.venue} • {pub.year}
                                </Typography>
                                <Chip
                                  label={`${pub.citations} citations`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < Math.min(4, data.publications.length - 1) && <Divider />}
                    </Box>
                  ))}
                  {data.publications.length > 5 && (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
                      And {data.publications.length - 5} more publications...
                    </Typography>
                  )}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No publications found
                </Typography>
              )}
            </CardContent>
          </Card>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={handleClear}
              startIcon={<DeleteIcon />}
              color="error"
              variant="outlined"
            >
              Clear Profile
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};
