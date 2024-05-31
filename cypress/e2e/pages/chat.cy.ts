describe('Chat successful flow', () => {
  it('should type prompt then send to chat in page', () => {
    cy.visit('/chat')
    cy.get('.app-chat').click()
    cy.get('#prompt-input').clear()
    cy.get('#prompt-input').type(
      'Generate a landing website for an Online Coach/Business Consultancy business and make sure to pre fill the content and make it as cool as possible'
    )
    cy.get('#submit-button').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/chat')
  })
})
