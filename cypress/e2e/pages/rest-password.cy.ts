describe('Reset Password successful flow', () => {
  it('should send forgot email request successfully', () => {
    cy.visit('/reset-password')
    cy.get('#email').clear()
    cy.get('#email').type('admin@safha.com')
    cy.get('#submit-button').click()
    cy.url({ timeout: 30000 }).should('eq', Cypress.config().baseUrl + '/signin')
  })
})
