/// <reference types="cypress" />

describe('Register User in Event', () => {
  const event_id = '624362c612e3604d37212ed3'
  const email = 'pruebacypress160@mocionsoft.com'
  const uuid = () => Cypress._.random(0, 1e6)
  const id = uuid()
  const emailNew = 'pruebascypress' + id + '@mocionsoft.com'
  const clave = 'mocion.2040'
  const newPassword = 'mocion.2041'
  const nombre = 'Cyprees'
  const apellido = 'Prueba'

  let resetLink = ''
  let linkLogin = ''

  beforeEach(() => {
    switch (Cypress.currentTest.title) {
      case 'it should change the password and log in with the new password':
        cy.log('it should change the password and log in with the new password')
        break
      case 'it should login using email':
        cy.log('it should login using email')
        break
      default:
        cy.visitEvent()
        break
    }
  })
  it('I should do the registration', () => {
    const filePath = 'mocion.jpg'
    cy.get("input[type='file']").attachFile(filePath)
    cy.contains('OK').click()
    cy.wait(1000)
    cy.get('input[type=email]').type(emailNew)
    cy.get('input[type=password]').type(clave)
    cy.get('#names').type(nombre + ' ' + apellido)
    cy.get('#btnnextRegister').should('not.be.disabled')
    cy.get('#btnnextRegister').click()
    cy.wait(1000)
    //cy.contains('Datos del usuario').should('exist');
    cy.contains(nombre + ' ' + apellido).should('exist')
    cy.contains(emailNew).should('exist')
    cy.get('#btnnextRegister').click()
    cy.wait(4000)
    cy.get('.ant-result-title').should('exist')
    cy.get('.ant-typography.ant-typography-secondary').should('exist')
    cy.wait(15000)
    cy.logout()
  })

  it('You should log in to the platform', () => {
    cy.changeLogin()
    cy.login(emailNew, clave)
    cy.logout()
  })
  it('The email sent alert should appear', () => {
    cy.changeLogin()
    cy.get('#forgotpassword').click()
    cy.wait(1000)
    cy.get('input[type=email]').eq(4).type(email)
    cy.get('button[type=submit]').eq(3).click()
    cy.wait(3000)
    cy.get('.ant-alert-message').should('exist')
  })
  it('it should change the password and log in with the new password', () => {
    cy.request({
      method: 'PUT',
      url: 'https://devapi.evius.co/api/changeuserpassword',
      body: {
        email: email,
        event_id: event_id,
        hostName: 'https://www.google.com',
      },
      headers: {
        accept: 'application/json',
      },
    }).then((response) => {
      resetLink = response.body.data.link
      cy.visit(resetLink)
      cy.wait(2000)
      cy.get('input[type=password]').type(newPassword)
      cy.get('button[type=submit]').click()
      cy.wait(4000)
      cy.get('button[type=submit]').click()
      cy.changeLogin()
      cy.login(email, newPassword)
      cy.wait(5000)
      cy.logout()
      cy.wait(5000)
    })
  })
  it('It should send the access to the mail', () => {
    cy.changeLogin()
    cy.get('.ant-btn.ant-btn-primary.ant-btn-lg.ant-btn-block').click()
    cy.wait(1000)
    cy.get('input[type=email]').eq(4).type(email)
    cy.wait(1000)
    cy.get('button[type=submit]').eq(3).click()
    cy.wait(3000)
    cy.get('.ant-alert-message').should('exist')
  })
  it('it should login using email', () => {
    cy.request({
      method: 'POST',
      url: 'https://devapi.evius.co/api/getloginlink',
      body: {
        email: email,
      },
      headers: {
        accept: 'application/json',
      },
    }).then((response) => {
      linkLogin = response.body
      cy.visit(linkLogin)
      cy.wait(10000)
      // Esta condicional es por si el usuario esta loqueado en otro equipo
      // if (cy.contains('Ya has iniciado la sesión en otro dispositivo').should('exist')) {
      //   cy.contains('button', 'Continuar').click();
      // }
      cy.wait(8000)
      cy.logoutWithOutEvent()
    })
  })
  it('it should log in to the platform', () => {
    cy.changeLogin()
    cy.login(email, newPassword)
    cy.logout()
  })
})
