/// <reference types="cypress" />

describe('Login User in Event', () => {
  const eventToTest = '/landing/624362c612e3604d37212ed3/evento';
  const stagingUrl = 'https://staging.evius.co';
  const localUrl = 'http://localhost:3000';
  const email = 'mario.montero@mocionsoft.com';
  const emailCypress = 'pruebasCypressNoFound@mocionsoft.com';
  const clave = 'mocion.2040';
  const nombre = 'Mario Montero';

  beforeEach(() => {
    if (process.env.NODE_ENV === 'production') {
      cy.visit(`${stagingUrl}${eventToTest}`);
    } else {
      cy.visit(`${localUrl}${eventToTest}`);
    }
  });
  it('It should show the login modal and switch to the login form', () => {
    cy.wait(4000);
    cy.get('.ant-modal-body').should('exist');
    cy.contains('Registrarme').should('exist');
    cy.get('#rc-tabs-0-tab-login').click();
  });
  it('It should show the login modal and switch to the login form', () => {
    cy.wait(4000);
    cy.get('.ant-modal-body').should('exist');
    cy.contains('Registrarme').should('exist');
    cy.get('#rc-tabs-0-tab-login').click();
    cy.get('#email').should('be.empty');
    cy.get('#password').should('be.empty');
    cy.get('#loginButton').click();
    cy.wait(1000);
    cy.contains('Ingrese un correo').should('exist');
    cy.contains('Ingrese una contraseña').should('exist');
  });
  it('It should not allow the login, because the email field does not comply with the format and the password field is empty', () => {
    cy.wait(4000);
    cy.get('.ant-modal-body').should('exist');
    cy.contains('Registrarme').should('exist');
    cy.get('#rc-tabs-0-tab-login').click();
    cy.get('#email').type(nombre);
    cy.get('#email').click();
    cy.get('#password').should('be.empty');
    cy.get('#loginButton').click();
  });
  it('It should not allow login, because the password field is empty', () => {
    cy.wait(4000);
    cy.get('.ant-modal-body').should('exist');
    cy.contains('Registrarme').should('exist');
    cy.get('#rc-tabs-0-tab-login').click();
    cy.get('#email').type(email);
    cy.get('#password').should('be.empty');
    cy.get('#loginButton').click();
    cy.contains('Ingrese una contraseña').should('exist');
  });
  it('An alert should appear, because the email does not exist', () => {
    cy.wait(4000);
    cy.get('.ant-modal-body').should('exist');
    cy.contains('Registrarme').should('exist');
    cy.get('#rc-tabs-0-tab-login').click();
    cy.get('#email').type(emailCypress);
    cy.get('#password').type(clave);
    cy.get('#loginButton').click();
    cy.wait(1000);
    cy.contains('este email no esta registrado').should('exist');
  });
  it('An alert should appear, because the password is incorrect', () => {
    cy.wait(4000);
    cy.get('.ant-modal-body').should('exist');
    cy.contains('Registrarme').should('exist');
    cy.get('#rc-tabs-0-tab-login').click();

    cy.get('#email').type(email);
    cy.get('#password').type('123456');
    cy.get('#loginButton').click();
    cy.wait(1000);
    cy.contains('La contraseña es incorrecta').should('exist');
  });
  it.only('You should log in to the platform', () => {
    cy.wait(4000);
    cy.get('.ant-modal-body').should('exist');
    cy.contains('Registrarme').should('exist');
    cy.get('#rc-tabs-0-tab-login').click();
    cy.get('#email').type(email);
    cy.get('#password').type(clave);
    cy.get('#loginButton').click();
    cy.wait(1000);
    cy.get('.ant-dropdown-trigger')
      .eq(0)
      .trigger('mouseover');
    cy.contains('Administración').should('exist');
    cy.wait(10000);
  });
});
