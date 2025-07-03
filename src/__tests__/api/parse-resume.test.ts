import { NextRequest} from 'next/server';
import { POST } from '@/app/api/parse-resume/route';

// Mock the pdf-parse library
jest.mock('pdf-parse', () => {
  return jest.fn().mockResolvedValue({
    text: `
      John Doe
      john.doe@email.com
      +1234567890
      
      EXPERIENCE
      Software Developer at Tech Corp (2020-2023)
      - Developed web applications using React and Node.js
      - Led a team of 5 developers
      
      EDUCATION
      Bachelor of Science in Computer Science
      University of Technology (2016-2020)
      
      SKILLS
      JavaScript, React, Node.js, Python, SQL
    `
  });
});

// Mock mammoth library
jest.mock('mammoth', () => ({
  extractRawText: jest.fn().mockResolvedValue({
    value: `
      John Doe
      john.doe@email.com
      +1234567890
      
      EXPERIENCE
      Software Developer at Tech Corp (2020-2023)
      - Developed web applications using React and Node.js
      
      EDUCATION
      Bachelor of Science in Computer Science
      University of Technology (2016-2020)
      
      SKILLS
      JavaScript, React, Node.js, Python, SQL
    `
  })
}));

describe('/api/parse-resume', () => {
  const createMockFormData = (fileName: string, fileType: string, content: string = 'test content') => {
    const file = new File([content], fileName, { type: fileType });
    const formData = new FormData();
    formData.append('resume', file);
    return formData;
  };

  test('successfully parses PDF resume', async () => {
    const formData = createMockFormData('resume.pdf', 'application/pdf');
    const request = new NextRequest('http://localhost:3000/api/parse-resume', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('name', 'John Doe');
    expect(data).toHaveProperty('email', 'john.doe@email.com');
    expect(data).toHaveProperty('phone', '+1234567890');
    expect(data.skills).toContain('JavaScript');
    expect(data.skills).toContain('React');
    expect(data.experience).toHaveLength(1);
    expect(data.education).toHaveLength(1);
  });

  test('successfully parses DOCX resume', async () => {
    const formData = createMockFormData('resume.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    const request = new NextRequest('http://localhost:3000/api/parse-resume', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('name', 'John Doe');
    expect(data).toHaveProperty('email', 'john.doe@email.com');
    expect(data.skills).toContain('JavaScript');
  });

  test('rejects invalid file types', async () => {
    const formData = createMockFormData('resume.txt', 'text/plain');
    const request = new NextRequest('http://localhost:3000/api/parse-resume', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('file type');
  });

  test('rejects files that are too large', async () => {
    // Create a large file (simulate 6MB)
    const largeContent = 'x'.repeat(6 * 1024 * 1024);
    const formData = createMockFormData('large-resume.pdf', 'application/pdf', largeContent);
    const request = new NextRequest('http://localhost:3000/api/parse-resume', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('file size');
  });

  test('handles missing file', async () => {
    const formData = new FormData();
    const request = new NextRequest('http://localhost:3000/api/parse-resume', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('No file');
  });

  test('handles GET method (should return 405)', async () => {
    const request = new NextRequest('http://localhost:3000/api/parse-resume', {
      method: 'GET',
    });

    const response = await POST(request);
    
    expect(response.status).toBe(405);
  });

  test('extracts education information correctly', async () => {
    const formData = createMockFormData('resume.pdf', 'application/pdf');
    const request = new NextRequest('http://localhost:3000/api/parse-resume', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.education).toHaveLength(1);
    expect(data.education[0]).toHaveProperty('degree');
    expect(data.education[0]).toHaveProperty('institution');
    expect(data.education[0]).toHaveProperty('year');
    expect(data.education[0].degree).toContain('Computer Science');
    expect(data.education[0].institution).toContain('University of Technology');
  });

  test('extracts experience information correctly', async () => {
    const formData = createMockFormData('resume.pdf', 'application/pdf');
    const request = new NextRequest('http://localhost:3000/api/parse-resume', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.experience).toHaveLength(1);
    expect(data.experience[0]).toHaveProperty('title');
    expect(data.experience[0]).toHaveProperty('company');
    expect(data.experience[0]).toHaveProperty('duration');
    expect(data.experience[0].title).toContain('Software Developer');
    expect(data.experience[0].company).toContain('Tech Corp');
  });

  test('handles malformed resume text gracefully', async () => {
    // Mock pdf-parse to return minimal/malformed text
    const pdfParse = require('pdf-parse');
    pdfParse.mockResolvedValueOnce({
      text: 'This is not a proper resume format'
    });

    const formData = createMockFormData('malformed-resume.pdf', 'application/pdf');
    const request = new NextRequest('http://localhost:3000/api/parse-resume', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('skills');
    expect(data).toHaveProperty('education');
    expect(data).toHaveProperty('experience');
    // Should return empty arrays for skills, education, experience if not found
    expect(Array.isArray(data.skills)).toBe(true);
    expect(Array.isArray(data.education)).toBe(true);
    expect(Array.isArray(data.experience)).toBe(true);
  });
});
