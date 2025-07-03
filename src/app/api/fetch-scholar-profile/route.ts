import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

// Rate limiting map - in production, use Redis or similar
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function rateLimit(ip: string, maxRequests = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userLimit.count >= maxRequests) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Basic rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(ip)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const { profileUrl } = await request.json();
    
    if (!profileUrl) {
      return NextResponse.json({ error: 'Profile URL is required' }, { status: 400 });
    }

    // Validate Google Scholar URL
    if (!profileUrl.includes('scholar.google.com')) {
      return NextResponse.json({ error: 'Invalid Google Scholar URL' }, { status: 400 });
    }

    // Fetch the Scholar profile page
    const response = await fetch(profileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch Scholar profile' }, { status: 404 });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract profile information
    const name = $('#gsc_prf_in').text().trim() || 'Unknown';
    const affiliation = $('#gsc_prf_inw+ .gsc_prf_il').text().trim() || 'Unknown';
    
    // Extract research interests
    const researchInterests: string[] = [];
    $('#gsc_prf_int .gsc_prf_inta').each((_, element) => {
      const interest = $(element).text().trim();
      if (interest) researchInterests.push(interest);
    });

    // Extract citation metrics
    const totalCitations = parseInt($('#gsc_rsb_st tbody tr:first-child td:nth-child(2)').text().trim()) || 0;
    const hIndex = parseInt($('#gsc_rsb_st tbody tr:nth-child(2) td:nth-child(2)').text().trim()) || 0;
    const i10Index = parseInt($('#gsc_rsb_st tbody tr:nth-child(3) td:nth-child(2)').text().trim()) || 0;

    // Extract publications
    const publications: Array<{
      title: string;
      authors: string;
      year: string;
      citations: number;
      venue: string;
    }> = [];

    $('#gsc_a_b .gsc_a_tr').each((index, element) => {
      if (index >= 10) return; // Limit to first 10 publications
      
      const title = $(element).find('.gsc_a_at').text().trim();
      const authors = $(element).find('.gsc_a_at').next().text().trim();
      const venue = $(element).find('.gsc_a_at').next().next().text().trim();
      const year = $(element).find('.gsc_a_y').text().trim();
      const citationsText = $(element).find('.gsc_a_c a').text().trim();
      const citations = citationsText ? parseInt(citationsText) : 0;

      if (title) {
        publications.push({
          title,
          authors,
          year,
          citations,
          venue
        });
      }
    });

    const scholarData = {
      name,
      affiliation,
      researchInterests,
      publications,
      totalCitations,
      hIndex,
      i10Index
    };

    return NextResponse.json(scholarData);
  } catch (error) {
    console.error('Error fetching Scholar profile:', error);
    return NextResponse.json({ error: 'Failed to fetch Scholar profile' }, { status: 500 });
  }
}
