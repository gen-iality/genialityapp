/// <reference types="cypress" />

describe('Login User in Event', () => {
  const email = 'pruebascypress@mocionsoft.com';
  const emailCypress = 'pruebascypressnofoundtest@mocionsoft.com';
  const clave = 'mocion.2040';
  const nombre = 'Cypreess Prueba';

  beforeEach(() => {
    cy.visitEvent();
  });
  it('It should show the login modal and switch to the login form', () => {
    cy.changeLogin();
  });
  it('It should show empty fields message in email and password', () => {
    cy.changeLogin();
    cy.get('#email').should('be.empty');
    cy.get('#password').should('be.empty');
    cy.get('#loginButton').click();
    cy.wait(1000);
    cy.contains('Ingrese un correo').should('exist');
    cy.contains('Ingrese una contraseña').should('exist');
  });
  it('It should not allow the login, because the email field does not comply with the format and the password field is empty', () => {
    cy.changeLogin();
    cy.get('#email').type(nombre);
    cy.get('#email').click();
    cy.get('#password').should('be.empty');
    cy.get('#loginButton').click();
  });
  it('It should not allow login, because the password field is empty', () => {
    cy.changeLogin();
    cy.get('#email').type(email);
    cy.get('#password').should('be.empty');
    cy.get('#loginButton').click();
    cy.contains('Ingrese una contraseña').should('exist');
  });
  it('An alert should appear, because the email does not exist', () => {
    cy.changeLogin();
    cy.login(emailCypress, clave);
    cy.wait(1000);
    cy.contains('este email no esta registrado').should('exist');
  });
  it('An alert should appear, because the password is incorrect', () => {
    cy.changeLogin();
    cy.login(email, '123456');
    cy.wait(1000);
    cy.contains('La contraseña es incorrecta').should('exist');
  });
  it('You should log in to the platform', () => {
    cy.changeLogin();
    cy.login(email, clave);
    cy.logout();
  });
});
