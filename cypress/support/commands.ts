/// <reference types="cypress" />

// Custom command to upload a file
Cypress.Commands.add('uploadFile', (fileName: string, fileType: string = 'application/pdf') => {
  cy.fixture(fileName, 'base64').then(fileContent => {
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from(fileContent, 'base64'),
      fileName: fileName,
      mimeType: fileType,
    }, { force: true });
  });
});

// Custom command to fill Scholar URL
Cypress.Commands.add('fillScholarUrl', (url: string) => {
  cy.get('input[placeholder*="scholar.google.com"]').type(url);
  cy.get('button').contains('Fetch Profile').click();
});

// Custom command to wait for project suggestions
Cypress.Commands.add('waitForProjectSuggestions', () => {
  cy.get('button').contains('Generate Project Suggestions').click();
  cy.get('[data-testid="project-suggestions"]', { timeout: 15000 }).should('be.visible');
});
