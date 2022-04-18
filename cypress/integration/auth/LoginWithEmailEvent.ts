/// <reference types="cypress" />
describe('Login with Email in Event', () => {
  const email = 'pruebascypress@mocionsoft.com';
  const emailNoFound = 'pruebascypressnofound443@mocionsoft.com';

  const nombre = 'Cypreess Prueba';
  let linkLogin: string;

  beforeEach(() => {
    switch (Cypress.currentTest.title) {
      case 'it should login using email':
        cy.log('it should login using email');
        break;
      default:
        cy.visitEvent();
        break;
    }
  });

  it('It should show the login modal and switch to the login form', () => {
    cy.changeLogin();
    cy.contains('Iniciar sesión solo con mi correo').should('exist');
  });
  it('It should show the modal to login with mail', () => {
    cy.changeLogin();
    cy.contains('Iniciar sesión solo con mi correo').click();
    cy.get('#submitButton').should('exist');
  });
  it('I should not send the access to my email because the input is not an email', () => {
    cy.changeLogin();
    cy.contains('Iniciar sesión solo con mi correo').click();
    cy.wait(1000);
    cy.get('input[type=email]')
      .eq(4)
      .type(nombre);
    cy.wait(1000);
    cy.contains('Ingrese un correo válido').should('exist');
  });
  it('I should not send the access to my email because  email no exist', () => {
    cy.changeLogin();
    cy.contains('Iniciar sesión solo con mi correo').click();
    cy.wait(1000);
    cy.get('input[type=email]')
      .eq(4)
      .type(emailNoFound);
    cy.wait(1000);
    cy.get('button[type=submit]')
      .eq(3)
      .click();
    cy.wait(3000);
    cy.get('.ant-alert-message').should('exist');
  });
  it('I should  send the access to my email', () => {
    cy.changeLogin();
    cy.contains('Iniciar sesión solo con mi correo').click();
    cy.wait(1000);
    cy.get('input[type=email]')
      .eq(4)
      .type(email);
    cy.wait(1000);
    cy.get('button[type=submit]')
      .eq(3)
      .click();
    cy.wait(3000);
    cy.get('.ant-alert-message').should('exist');
  });
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
      linkLogin = response.body;
      cy.visit(linkLogin);
      cy.wait(10000);
      // Esta condicional es por si el usuario esta loqueado en otro equipo
      if (cy.contains('Ya has iniciado la sesión en otro dispositivo').should('exist')) {
        cy.contains('button', 'Continuar').click();
      }
      //este prueba puede fallar si el usuario no esta loqueado en otro equipo
      cy.wait(5000);
      cy.logout();
    });
  });
});
