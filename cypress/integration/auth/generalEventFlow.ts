/// <reference types="cypress" />

import cypress from 'cypress';

describe('Register User in Event', () => {
  const eventToTest = '/landing/624362c612e3604d37212ed3/evento';
  const stagingUrl = 'https://staging.evius.co';
  const localUrl = 'http://localhost:3000';
  const event_id = '624362c612e3604d37212ed3';
  const email = 'mario.montero@mocionsoft.com';
  const emailCypress = 'cristian.florez@mocionsoft.com';
  const clave = 'mocion.2040';
  const newPassword = 'mocion.2041';
  const nombre = 'Mario Montero';
  const apellido = 'Montero';
  const telefono = '12345678';
  const celular = '12345678';
  const pais = 'Colombia';
  const ciudad = 'Bogota';
  const direccion = 'Calle 1';
  const codigoPostal = '12345';
  const nombreEmpresa = 'MocionSoft';
  const cargo = 'Arquitecto';
  var token = '';
  var id = '';
  var eventUserID = '';
  let resetLink = '';
  let linkLogin = '';

  beforeEach(() => {
    switch (Cypress.currentTest.title) {
      case 'it should change the password and log in with the new password':
        cy.log('it should change the password and log in with the new password');
        break;
      case 'it should login using email':
        cy.log('it should login using email');
        break;
      default:
        if (process.env.NODE_ENV === 'production') {
          cy.visit(`${stagingUrl}${eventToTest}`);
        } else {
          cy.visit(`${localUrl}${eventToTest}`);
        }
        break;
    }
  });
  it('I should do the registration', () => {
    const filePath = 'mocion.jpg';
    cy.get("input[type='file']").attachFile(filePath);
    cy.contains('OK').click();
    cy.wait(1000);
    cy.get('input[type=email]')
      .eq(1)
      .type(emailCypress);
    cy.get('input[type=password]')
      .eq(1)
      .type(clave);
    cy.get('#names').type(nombre + ' ' + apellido);
    cy.get('#btnnextRegister').should('not.be.disabled');
    cy.get('#btnnextRegister').click();
    cy.wait(1000);
    cy.contains('Datos del usuario').should('exist');
    cy.contains(nombre + ' ' + apellido).should('exist');
    cy.contains(emailCypress).should('exist');
    cy.get('#btnnextRegister').click();
    cy.wait(4000);
    cy.contains('¡Registro exitoso!').should('exist');
    cy.contains('Iniciando sesión con tu cuenta!').should('exist');
    cy.wait(15000);
    cy.get('.ant-modal-body')
      .contains('Inscribirme al evento')
      .click();
    cy.wait(15000);
    cy.get('.ant-dropdown-trigger')
      .eq(0)
      .trigger('mouseover');
    cy.contains('Administración').should('exist');
    cy.contains('Cerrar sesión').click();
    cy.wait(2000);
    cy.contains('Si, cerrar la sesión').click();
    cy.wait(5000);
  });

  it('You should log in to the platform', () => {
    cy.wait(4000);
    cy.get('.ant-modal-body').should('exist');
    cy.contains('Registrarme').should('exist');
    cy.get('#rc-tabs-0-tab-login').click();
    cy.get('#email').type(emailCypress);
    cy.get('#password').type(clave);
    cy.get('#loginButton').click();
    cy.wait(1000);
    cy.get('.ant-dropdown-trigger')
      .eq(0)
      .trigger('mouseover');
    cy.contains('Administración').should('exist');
    cy.wait(2000);
    cy.contains('Si, cerrar la sesión').click();
    cy.wait(5000);
  });
  it('The email sent alert should appear', () => {
    cy.wait(5000);
    cy.get('.ant-modal-body').should('exist');
    cy.contains('Registrarme').should('exist');
    cy.get('#rc-tabs-0-tab-login').click();
    cy.contains('Olvidé mi contraseña').click();
    cy.wait(1000);
    cy.get('input[type=email]')
      .eq(4)
      .type(emailCypress);
    cy.get('button[type=submit]')
      .eq(3)
      .click();
    cy.wait(3000);
    cy.get('.ant-alert-message').should('exist');
  });
  it.only('it should change the password and log in with the new password', () => {
    cy.request({
      method: 'PUT',
      url: `https://devapi.evius.co/api/changeuserpassword`,
      body: {
        email: emailCypress,
        event_id: event_id,
        hostName: 'https://www.google.com',
      },
      headers: {
        accept: 'application/json',
      },
    }).then((response) => {
      resetLink = response.body.data.link;
      cy.visit(resetLink);
      cy.wait(2000);
      cy.get('input[type=password]').type(newPassword);
      cy.get('button[type=submit]').click();
      cy.wait(4000);
      cy.get('button[type=submit]').click();
      cy.wait(4000);
      cy.get('.ant-modal-body').should('exist');
      cy.contains('Registrarme').should('exist');
      cy.get('#rc-tabs-0-tab-login').click();
      cy.get('#email').type(emailCypress);
      cy.get('#password').type(newPassword);
      cy.get('#loginButton').click();
      cy.wait(5000);
      cy.get('.ant-dropdown-trigger')
        .eq(0)
        .trigger('mouseover');
      cy.contains('Administración').should('exist');
      cy.contains('Cerrar sesión').click();
      cy.wait(2000);
      cy.contains('Si, cerrar la sesión').click();
      cy.wait(5000);
    });
  });
  it('It should send the access to the mail', () => {
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

      cy.wait(5000);
      cy.get('.ant-dropdown-trigger')
        .eq(0)
        .trigger('mouseover');
      cy.contains('Administración').should('exist');
      cy.contains('Cerrar sesión').click();
      cy.wait(2000);
      cy.contains('Si, cerrar la sesión').click();
      cy.wait(5000);
    });
  });
  it('You should log in to the platform', () => {
    cy.wait(4000);
    cy.get('.ant-modal-body').should('exist');
    cy.contains('Registrarme').should('exist');
    cy.get('#rc-tabs-0-tab-login').click();
    cy.get('#email').type(emailCypress);
    cy.get('#password').type(newPassword);
    cy.get('#loginButton').click();
    cy.wait(1000);
    cy.get('.ant-dropdown-trigger')
      .eq(0)
      .trigger('mouseover');

    cy.contains('Administración').should('exist');
    cy.contains('Cerrar sesión').click();
    cy.wait(2000);
    cy.contains('Si, cerrar la sesión').click();
    cy.wait(5000);
  });
});
