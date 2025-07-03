import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only PDF and DOCX files are allowed.' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size too large. Maximum size is 5MB.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = '';

    if (file.type === 'application/pdf') {
      const pdfParse = (await import('pdf-parse')).default;
      const pdfData = await pdfParse(buffer);
      text = pdfData.text;
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    }

    // Parse the extracted text to structure the resume data
    const resumeData = parseResumeText(text);

    return NextResponse.json(resumeData);
  } catch (error) {
    console.error('Error parsing resume:', error);
    return NextResponse.json({ error: 'Failed to parse resume' }, { status: 500 });
  }
}

function parseResumeText(text: string) {
  // Simple parsing logic - in a real application, you'd use more sophisticated NLP
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Extract basic information using patterns
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const phonePattern = /\+?[\d\s\-\(\)]{10,}/;
  
  let name = '';
  let email = '';
  let phone = '';
  const skills: string[] = [];
  const education: Array<{ degree: string; institution: string; year: string }> = [];
  const experience: Array<{ title: string; company: string; duration: string; description: string }> = [];

  // Extract name (assume first non-empty line is the name)
  if (lines.length > 0) {
    name = lines[0];
  }

  // Extract email and phone
  for (const line of lines) {
    const emailMatch = line.match(emailPattern);
    if (emailMatch && !email) {
      email = emailMatch[0];
    }
    
    const phoneMatch = line.match(phonePattern);
    if (phoneMatch && !phone) {
      phone = phoneMatch[0];
    }
  }

  // Extract skills (look for common skill keywords)
  const skillKeywords = ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Machine Learning', 'Data Science', 'AI', 'TypeScript', 'SQL', 'AWS', 'Docker', 'Git'];
  for (const line of lines) {
    for (const skill of skillKeywords) {
      if (line.toLowerCase().includes(skill.toLowerCase()) && !skills.includes(skill)) {
        skills.push(skill);
      }
    }
  }

  // Simple extraction for education and experience
  // In a real application, you'd use more sophisticated parsing
  let currentSection = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    
    if (line.includes('education') || line.includes('academic')) {
      currentSection = 'education';
      continue;
    }
    
    if (line.includes('experience') || line.includes('work') || line.includes('employment')) {
      currentSection = 'experience';
      continue;
    }
    
    if (currentSection === 'education' && lines[i].length > 10) {
      // Simple education parsing
      education.push({
        degree: lines[i],
        institution: i + 1 < lines.length ? lines[i + 1] : '',
        year: extractYear(lines[i]) || (i + 1 < lines.length ? extractYear(lines[i + 1]) : '') || ''
      });
    }
    
    if (currentSection === 'experience' && lines[i].length > 10) {
      // Simple experience parsing
      experience.push({
        title: lines[i],
        company: i + 1 < lines.length ? lines[i + 1] : '',
        duration: extractDuration(lines[i]) || (i + 1 < lines.length ? extractDuration(lines[i + 1]) : '') || '',
        description: i + 2 < lines.length ? lines[i + 2] : ''
      });
    }
  }

  return {
    name,
    email,
    phone,
    skills,
    education: education.slice(0, 5), // Limit to avoid duplicates
    experience: experience.slice(0, 5) // Limit to avoid duplicates
  };
}

function extractYear(text: string): string | null {
  const yearPattern = /\b(19|20)\d{2}\b/;
  const match = text.match(yearPattern);
  return match ? match[0] : null;
}

function extractDuration(text: string): string | null {
  const durationPatterns = [
    /\b\d{4}\s*-\s*\d{4}\b/,
    /\b\d{4}\s*-\s*present\b/i,
    /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{4}/i
  ];
  
  for (const pattern of durationPatterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  
  return null;
}
