describe('ScholarSync Main Application Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays the homepage correctly', () => {
    cy.contains('ScholarSync').should('be.visible');
    cy.contains('Intelligent Research Project Discovery Platform').should('be.visible');
    cy.contains('How It Works').should('be.visible');
    
    // Check for the three main feature cards
    cy.contains('Upload Resume').should('be.visible');
    cy.contains('Scholar Profile').should('be.visible');
    cy.contains('Get Suggestions').should('be.visible');
  });

  it('shows the resume upload section', () => {
    cy.contains('Resume Analysis').should('be.visible');
    cy.contains('Drop your resume here or click to browse').should('be.visible');
    cy.contains('Supports PDF and DOCX files').should('be.visible');
  });

  it('shows the Scholar profile input section', () => {
    cy.contains('Google Scholar Profile').should('be.visible');
    cy.get('input[placeholder*="scholar.google.com"]').should('be.visible');
    cy.contains('Fetch Profile').should('be.visible');
    cy.contains('Copy your Google Scholar profile URL').should('be.visible');
  });

  it('shows the project suggestions section', () => {
    cy.contains('Project Recommendations').should('be.visible');
    cy.contains('Ready to Discover Your Next Project?').should('be.visible');
  });

  it('validates resume file upload', () => {
    // Test file input validation
    cy.get('input[type="file"]').should('have.attr', 'accept', '.pdf,.docx');
  });

  it('validates Scholar URL input', () => {
    const invalidUrl = 'not-a-valid-url';
    cy.get('input[placeholder*="scholar.google.com"]').type(invalidUrl);
    cy.get('button').contains('Fetch Profile').click();
    
    // Should show HTML5 validation error
    cy.get('input[placeholder*="scholar.google.com"]').then(($input) => {
      expect($input[0].validity.valid).to.be.false;
    });
  });

  it('displays loading state correctly', () => {
    const scholarUrl = 'https://scholar.google.com/citations?user=test123';
    cy.get('input[placeholder*="scholar.google.com"]').type(scholarUrl);
    cy.get('button').contains('Fetch Profile').click();
    
    // Should show loading state (will fail in actual test due to no backend)
    cy.contains('Fetching Profile...').should('be.visible');
  });

  it('has responsive design elements', () => {
    // Test mobile viewport
    cy.viewport(375, 667);
    cy.contains('ScholarSync').should('be.visible');
    cy.contains('Resume Analysis').should('be.visible');
    
    // Test tablet viewport
    cy.viewport(768, 1024);
    cy.contains('ScholarSync').should('be.visible');
    
    // Test desktop viewport
    cy.viewport(1280, 720);
    cy.contains('ScholarSync').should('be.visible');
  });

  it('has proper navigation and layout', () => {
    // Check that all main sections are present
    cy.get('[data-testid="hero-section"]').should('be.visible');
    cy.get('[data-testid="features-section"]').should('be.visible');
    cy.get('[data-testid="main-application"]').should('be.visible');
    cy.get('[data-testid="statistics-section"]').should('be.visible');
    cy.get('[data-testid="footer-section"]').should('be.visible');
  });

  it('displays statistics correctly', () => {
    cy.contains('Platform Insights').should('be.visible');
    cy.contains('500+').should('be.visible');
    cy.contains('Project Templates').should('be.visible');
    cy.contains('95%').should('be.visible');
    cy.contains('Match Accuracy').should('be.visible');
  });

  it('has proper footer information', () => {
    cy.contains('ScholarSync').should('be.visible');
    cy.contains('Features').should('be.visible');
    cy.contains('Technology').should('be.visible');
    cy.contains('Next.js 15').should('be.visible');
    cy.contains('Material-UI').should('be.visible');
    cy.contains('© 2024 ScholarSync').should('be.visible');
  });

  it('handles keyboard navigation', () => {
    // Test tab navigation
    cy.get('body').tab();
    cy.focused().should('contain', 'Upload Resume');
    
    cy.focused().tab();
    cy.focused().should('be.visible');
  });

  it('displays proper error states', () => {
    // Test error handling for invalid file types
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('test content'),
      fileName: 'test.txt',
      mimeType: 'text/plain',
    }, { force: true });
    
    // Should show error message
    cy.contains('error', { matchCase: false }).should('be.visible');
  });
});
