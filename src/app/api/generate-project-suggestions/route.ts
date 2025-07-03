import { NextRequest, NextResponse } from 'next/server';
import { ResumeData } from '@/store/resumeSlice';
import { ScholarData } from '@/store/scholarSlice';
import { ProjectSuggestion } from '@/store/projectsSlice';

export async function POST(request: NextRequest) {
  try {
    const { resumeData, scholarData } = await request.json();
    
    if (!resumeData && !scholarData) {
      return NextResponse.json({ error: 'No data provided for suggestions' }, { status: 400 });
    }

    const suggestions = generateProjectSuggestions(resumeData, scholarData);
    
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error generating project suggestions:', error);
    return NextResponse.json({ error: 'Failed to generate project suggestions' }, { status: 500 });
  }
}

function generateProjectSuggestions(
  resumeData: ResumeData | null,
  scholarData: ScholarData | null
): ProjectSuggestion[] {
  const suggestions: ProjectSuggestion[] = [];
  
  // Collect all skills and research interests
  const skills: string[] = [];
  const researchInterests: string[] = [];
  
  if (resumeData) {
    skills.push(...resumeData.skills);
  }
  
  if (scholarData) {
    researchInterests.push(...scholarData.researchInterests);
  }

  // Project templates based on common skill combinations
  const projectTemplates = [
    // Web Development Projects
    {
      condition: (skills: string[]) => skills.some(s => ['JavaScript', 'React', 'TypeScript', 'Node.js'].includes(s)),
      projects: [
        {
          title: 'E-Learning Platform',
          description: 'Build a comprehensive online learning platform with course management, video streaming, and progress tracking.',
          category: 'Web Development',
          difficulty: 'Intermediate' as const,
          estimatedTime: '8-12 weeks',
          requiredSkills: ['React', 'Node.js', 'JavaScript', 'SQL'],
          tags: ['education', 'full-stack', 'responsive-design']
        },
        {
          title: 'Real-time Collaboration Tool',
          description: 'Create a real-time collaborative workspace with document editing, chat, and video calls.',
          category: 'Web Development',
          difficulty: 'Advanced' as const,
          estimatedTime: '12-16 weeks',
          requiredSkills: ['React', 'Node.js', 'WebSocket', 'TypeScript'],
          tags: ['real-time', 'collaboration', 'websockets']
        }
      ]
    },
    
    // Machine Learning Projects
    {
      condition: (skills: string[], interests: string[]) => 
        skills.some(s => ['Python', 'Machine Learning', 'AI', 'Data Science'].includes(s)) ||
        interests.some(i => i.toLowerCase().includes('machine learning') || i.toLowerCase().includes('ai')),
      projects: [
        {
          title: 'Academic Paper Recommendation System',
          description: 'Develop an AI system that recommends relevant academic papers based on research interests and citation patterns.',
          category: 'Machine Learning',
          difficulty: 'Advanced' as const,
          estimatedTime: '10-14 weeks',
          requiredSkills: ['Python', 'Machine Learning', 'NLP', 'Data Science'],
          tags: ['recommendation-system', 'nlp', 'academic-research']
        },
        {
          title: 'Research Trend Analysis Tool',
          description: 'Create a tool that analyzes trends in academic research using publication data and citation networks.',
          category: 'Data Science',
          difficulty: 'Intermediate' as const,
          estimatedTime: '6-10 weeks',
          requiredSkills: ['Python', 'Data Science', 'Machine Learning'],
          tags: ['data-analysis', 'visualization', 'research-trends']
        }
      ]
    },
    
    // Cloud/DevOps Projects
    {
      condition: (skills: string[]) => skills.some(s => ['AWS', 'Docker', 'Git'].includes(s)),
      projects: [
        {
          title: 'Automated Research Environment',
          description: 'Build a cloud-based platform for researchers with automated environment setup and collaboration tools.',
          category: 'Cloud Computing',
          difficulty: 'Advanced' as const,
          estimatedTime: '8-12 weeks',
          requiredSkills: ['AWS', 'Docker', 'Git', 'CI/CD'],
          tags: ['cloud', 'automation', 'research-tools']
        }
      ]
    },
    
    // Database Projects
    {
      condition: (skills: string[]) => skills.some(s => ['SQL', 'Database'].includes(s)),
      projects: [
        {
          title: 'Academic Publication Database',
          description: 'Design and implement a comprehensive database system for managing academic publications and citations.',
          category: 'Database',
          difficulty: 'Intermediate' as const,
          estimatedTime: '6-8 weeks',
          requiredSkills: ['SQL', 'Database Design', 'Data Modeling'],
          tags: ['database', 'academic', 'data-management']
        }
      ]
    },
    
    // General Projects (always shown)
    {
      condition: () => true,
      projects: [
        {
          title: 'Personal Research Portfolio',
          description: 'Create a professional website showcasing your research work, publications, and academic achievements.',
          category: 'Web Development',
          difficulty: 'Beginner' as const,
          estimatedTime: '3-5 weeks',
          requiredSkills: ['HTML', 'CSS', 'JavaScript'],
          tags: ['portfolio', 'personal-branding', 'responsive']
        },
        {
          title: 'Citation Network Visualizer',
          description: 'Build an interactive tool to visualize citation networks and research collaboration patterns.',
          category: 'Data Visualization',
          difficulty: 'Intermediate' as const,
          estimatedTime: '6-8 weeks',
          requiredSkills: ['JavaScript', 'D3.js', 'Data Visualization'],
          tags: ['visualization', 'network-analysis', 'citations']
        },
        {
          title: 'Research Collaboration Platform',
          description: 'Develop a platform connecting researchers with similar interests for potential collaborations.',
          category: 'Web Development',
          difficulty: 'Advanced' as const,
          estimatedTime: '10-12 weeks',
          requiredSkills: ['Full-stack Development', 'Database', 'API Development'],
          tags: ['collaboration', 'networking', 'research']
        }
      ]
    }
  ];

  // Generate suggestions based on matching templates
  projectTemplates.forEach(template => {
    if (template.condition(skills, researchInterests)) {
      template.projects.forEach(project => {
        // Calculate match score based on skill overlap
        const skillMatchCount = project.requiredSkills.filter(reqSkill => 
          skills.some(userSkill => userSkill.toLowerCase().includes(reqSkill.toLowerCase()))
        ).length;
        
        const matchScore = Math.min(95, Math.max(20, (skillMatchCount / project.requiredSkills.length) * 100));
        
        suggestions.push({
          id: `${project.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
          ...project,
          matchScore: Math.round(matchScore)
        });
      });
    }
  });

  // Add research-specific suggestions if scholar data is available
  if (scholarData && scholarData.researchInterests.length > 0) {
    scholarData.researchInterests.forEach((interest, index) => {
      suggestions.push({
        id: `research-${interest.toLowerCase().replace(/\s+/g, '-')}-${index}`,
        title: `${interest} Research Project`,
        description: `Develop a project specifically focused on ${interest} based on your research background and publications.`,
        category: 'Research',
        difficulty: 'Advanced' as const,
        estimatedTime: '12-16 weeks',
        requiredSkills: [interest, 'Research Methodology', 'Academic Writing'],
        matchScore: 90,
        tags: ['research', 'academic', interest.toLowerCase().replace(/\s+/g, '-')]
      });
    });
  }

  // Sort by match score and return top suggestions
  return suggestions
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 8); // Limit to top 8 suggestions
}
