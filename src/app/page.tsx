import { ResumeUploader } from "@/components/ResumeUploader";
import { ScholarProfileInput } from "@/components/ScholarProfileInput";
import { ProjectSuggestions } from "@/components/ProjectSuggestions";
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Paper
} from '@mui/material';
import { 
  Description as DescriptionIcon,
  School as SchoolIcon,
  Rocket as RocketIcon
} from '@mui/icons-material';

export default function Home() {
  return (
    <Box className="academic-pattern" sx={{ minHeight: '100vh' }}>
      {/* Hero Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #0288d1 100%)',
          color: 'white',
          textAlign: 'center',
          py: 8,
          px: 4,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            className="fade-in-up"
            sx={{
              mb: 2,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' }
            }}
          >
            ScholarSync
          </Typography>
          <Typography
            variant="h4"
            className="fade-in-up stagger-1"
            sx={{
              mb: 3,
              color: 'rgba(255,255,255,0.9)',
              fontSize: { xs: '1.25rem', md: '1.5rem' }
            }}
          >
            Intelligent Research Project Discovery Platform
          </Typography>
          <Typography
            variant="body1"
            className="fade-in-up stagger-2"
            sx={{
              maxWidth: '600px',
              mx: 'auto',
              color: 'rgba(255,255,255,0.8)',
              fontSize: { xs: '1rem', md: '1.125rem' }
            }}
          >
            Harness the power of AI to discover personalized research projects based on your academic profile and professional expertise
          </Typography>
        </Container>
      </Box>
      
      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Features Overview */}
        <Box className="fade-in-up stagger-1" sx={{ mb: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" sx={{ mb: 2, color: 'text.primary' }}>
              How It Works
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: '800px', mx: 'auto' }}>
              Our advanced AI analyzes your resume and Google Scholar profile to generate 
              tailored project recommendations that align with your skills and research interests.
            </Typography>
          </Box>
          
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
                <CardContent>
                  <DescriptionIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Upload Resume
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Parse your professional experience and extract key skills automatically
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
                <CardContent>
                  <SchoolIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Scholar Profile
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Connect your Google Scholar profile to analyze your research background
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
                <CardContent>
                  <RocketIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Get Suggestions
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Receive personalized project recommendations with match scores
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
        
        {/* Main Application */}
        <Grid container spacing={4}>
          {/* Left Column - Input Components */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Paper className="fade-in-up stagger-2" sx={{ p: 4 }}>
                <ResumeUploader />
              </Paper>
              
              <Paper className="fade-in-up stagger-3" sx={{ p: 4 }}>
                <ScholarProfileInput />
              </Paper>
            </Box>
          </Grid>
          
          {/* Right Column - Project Suggestions */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper 
              className="fade-in-up stagger-3" 
              sx={{ 
                p: 4, 
                position: { lg: 'sticky' }, 
                top: { lg: 32 },
                maxHeight: { lg: 'calc(100vh - 64px)' },
                overflow: 'auto'
              }}
            >
              <ProjectSuggestions />
            </Paper>
          </Grid>
        </Grid>
        
        {/* Statistics Section */}
        <Paper sx={{ mt: 10, p: 6, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Platform Insights
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>
            Empowering researchers and professionals worldwide
          </Typography>
          
          <Grid container spacing={4}>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box>
                <Typography variant="h3" color="primary.main" sx={{ fontWeight: 'bold', mb: 1 }}>
                  500+
                </Typography>
                <Typography color="text.secondary">Project Templates</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box>
                <Typography variant="h3" color="primary.main" sx={{ fontWeight: 'bold', mb: 1 }}>
                  95%
                </Typography>
                <Typography color="text.secondary">Match Accuracy</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box>
                <Typography variant="h3" color="primary.main" sx={{ fontWeight: 'bold', mb: 1 }}>
                  24/7
                </Typography>
                <Typography color="text.secondary">AI Processing</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box>
                <Typography variant="h3" color="primary.main" sx={{ fontWeight: 'bold', mb: 1 }}>
                  ∞
                </Typography>
                <Typography color="text.secondary">Possibilities</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      
      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 6, mt: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                ScholarSync
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.300', lineHeight: 1.6 }}>
                Bridging the gap between academic research and practical application through intelligent project matching.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Features
              </Typography>
              <Box sx={{ color: 'grey.300' }}>
                <Typography variant="body2">• AI-Powered Analysis</Typography>
                <Typography variant="body2">• Resume Parsing</Typography>
                <Typography variant="body2">• Scholar Integration</Typography>
                <Typography variant="body2">• Project Recommendations</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Technology
              </Typography>
              <Box sx={{ color: 'grey.300' }}>
                <Typography variant="body2">• Next.js 15</Typography>
                <Typography variant="body2">• TypeScript</Typography>
                <Typography variant="body2">• Redux Toolkit</Typography>
                <Typography variant="body2">• Material-UI</Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ borderTop: 1, borderColor: 'grey.700', mt: 4, pt: 4, textAlign: 'center', color: 'grey.400' }}>
            <Typography variant="body2">
              © 2025 ScholarSync - Advanced Research Project Discovery Platform
            </Typography>
            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
              Built with ❤️ for researchers, academics, and innovators worldwide
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
