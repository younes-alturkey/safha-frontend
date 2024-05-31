describe('SignUp successful flow', () => {
  it('should type name, email and password, signup then navigate to sign in page', () => {
    const random = Math.random().toString(36).substring(2, 15)
    const email = `${random}@safha.com`
    cy.visit('/signup')
    cy.get('#firstname').clear()
    cy.get('#firstname').type('Test')
    cy.get('#lastname').clear()
    cy.get('#lastname').type('User')
    cy.get('#email').clear()
    cy.get('#email').type(email)
    cy.get('#password').clear()
    cy.get('#password').type('Safha123..')
    cy.get('#signup-button').click()
    cy.url({ timeout: 30000 }).should('eq', Cypress.config().baseUrl + `/dash`)
  })
})
