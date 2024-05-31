describe('SignIn successful flow', () => {
  it('should type email and password, signin then navigate to home page', () => {
    cy.visit('/signin')
    cy.get('#email').clear()
    cy.get('#email').type('admin@safha.com')
    cy.get('#password').clear()
    cy.get('#password').type('Safha123..')
    cy.get('#signin-button').click()
    cy.url({ timeout: 30000 }).should('eq', Cypress.config().baseUrl + '/dash')
  })
})
