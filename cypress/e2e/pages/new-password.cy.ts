describe('New Password successful flow', () => {
  it('should be able to type password and confirm password', () => {
    cy.visit('/new-password?userEmail=younes@safha.com&token=test_token')
    cy.get('#password').clear()
    cy.get('#password').type('Safha123..')
    cy.get('#confirmPassword').clear()
    cy.get('#confirmPassword').type('Safha123..')
    cy.get('#submit-button').should('not.be.disabled')
  })
})
