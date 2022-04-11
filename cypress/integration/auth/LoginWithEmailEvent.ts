/// <reference types="cypress" />
describe('Login with Email in Event', () => {
  const eventToTest = '/landing/624362c612e3604d37212ed3/evento';
  const stagingUrl = 'https://staging.evius.co';
  const localUrl = 'http://localhost:3000';
  const email = 'cristian.florez@mocionsoft.com';
  const emailCypress = 'pruebasCypress01@mocionsoft.com';
  const nombre = 'Mario Montero';
  let linkLogin: string;

  it('It should show the login modal and switch to the login form', () => {
    cy.wait(5000);
    cy.get('.ant-modal-body').should('exist');
    cy.contains('Registrarme').should('exist');
    cy.get('#rc-tabs-0-tab-login').click();
    cy.contains('Iniciar sesión solo con mi correo').should('exist');
  });
  it('It should show the modal to login with mail', () => {
    cy.wait(5000);
    cy.get('.ant-modal-body').should('exist');
    cy.contains('Registrarme').should('exist');
    cy.get('#rc-tabs-0-tab-login').click();
    cy.contains('Iniciar sesión solo con mi correo').click();
    cy.get('#submitButton').should('exist');
  });
  it('I should not send the access to my email because the input is not an email', () => {
    cy.wait(5000);
    cy.get('.ant-modal-body').should('exist');
    cy.contains('Registrarme').should('exist');
    cy.get('#rc-tabs-0-tab-login').click();
    cy.contains('Iniciar sesión solo con mi correo').click();
    cy.wait(1000);
    cy.get('input[type=email]')
      .eq(4)
      .type(nombre);
    cy.wait(1000);
    cy.contains('Ingrese un correo válido').should('exist');
  });
  it('I should not send the access to my email because the input is not an email', () => {
    cy.visit(`${localUrl}${eventToTest}`);
    cy.wait(5000);
    cy.get('.ant-modal-body').should('exist');
    cy.contains('Registrarme').should('exist');
    cy.get('#rc-tabs-0-tab-login').click();
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

    //   cy.get('.ant-dropdown-trigger')
    //   .eq(0)
    //   .trigger('mouseover');
    // cy.contains('Administración').should('exist');
    // cy.wait(10000);
  });
  it.only('Deberia hacer el login usando el correo', () => {
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
      cy.contains('button', 'Continuar').click();
    });
  });
});
