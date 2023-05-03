/// <reference types="cypress" />

describe('Do login', () => {
  const email = 'contacto@geniality.com.co'
  const password = 'geniality.0505'

  it('Login', () => {
    cy.visitWebsite()
    cy.clickLoginButton()
    cy.typeLogin(email, password)

    cy.wait(15000)
    // NOTE: for small screen, this will get shown
    // cy.get('[data-testid="user-status-menu"]').should(
    //   'have.text',
    //   'Geniality Demo Comercial',
    // )

    cy.clickUserStatusMenuButton()
    cy.clickLogoutButton()
  })
})
