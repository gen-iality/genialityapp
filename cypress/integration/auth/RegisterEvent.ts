/// <reference types="cypress" />
describe('Register User in Event', () => {
  const uuid = () => Cypress._.random(0, 1e6);
  const id = uuid();
  const email = 'pruebascypress' + id + '@mocionsoft.com';
  const usedEmail = 'pruebascypress131@mocionsoft.com';
  const clave = 'mocion.2041';
  const nombre = 'Pruebas';
  const apellido = 'Cypress';
  // const telefono = '12345678';
  // const celular = '12345678';
  // const pais = 'Colombia';
  // const ciudad = 'Bogota';
  // const direccion = 'Calle 1';
  // const codigoPostal = '12345';
  // const nombreEmpresa = 'MocionSoft';
  // const cargo = 'Arquitecto';
  // let token = '';
  // let id = '';
  // let eventUserID = '';

  beforeEach(() => {
    cy.visitEvent();
  });

  it('it should show the registration modal', () => {
    cy.get('#rc-tabs-0-tab-register').should('exist');
    cy.get('#email').should('exist');
    cy.get('#password').should('exist');
    cy.get('#names').should('exist');
    cy.get('#btnnextRegister').should('be.disabled');
  });
  it('It should not allow registration, because the fields are empty', () => {
    cy.get('#email').should('be.empty');
    cy.get('#password').should('be.empty');
    cy.get('#names').should('be.empty');
    cy.get('#btnnextRegister').should('be.disabled');
  });
  it('It should not allow registration, because the fields are empty and the email is invalid', () => {
    cy.get('#rc-tabs-0-tab-register').should('exist');
    cy.wait(5000);
    cy.get('input[type=email]').type(apellido);
    cy.get('.ant-form-item-explain-error').should('exist');
    cy.get('#password').should('be.empty');
    cy.get('#names').should('be.empty');
    cy.get('#btnnextRegister').should('be.disabled');
  });
  it('It should not allow registration, because the Full name and password fields are empty', () => {
    cy.get('input[type=email]').type(email);
    cy.get('#password').should('be.empty');
    cy.get('#names').should('be.empty');
    cy.get('#btnnextRegister').should('be.disabled');
  });
  it('It should not allow registration, because the password field has a length less than 6 and the Full Name field is empty', () => {
    cy.get('input[type=email]').type(email);
    cy.get('input[type=password]').type('2323');
    cy.get('#names').should('be.empty');
    cy.get('#btnnextRegister').should('be.disabled');
    cy.get('.ant-form-item-explain-error').should('exist');
  });
  it('It should not allow registration, the Full Name field is empty', () => {
    cy.get('input[type=email]').type(email);
    cy.get('input[type=password]').type(clave);
    cy.get('#names').should('be.empty');
    cy.get('#btnnextRegister').should('be.disabled');
  });
  it('It should not allow registration because the mail is in use', () => {
    cy.get('input[type=email]').type(usedEmail);
    cy.get('input[type=password]').type(clave);
    cy.get('#names').type(nombre + ' ' + apellido);
    cy.get('#btnnextRegister').should('not.be.disabled');
    cy.get('#btnnextRegister').click();
    cy.wait(1000);
    cy.get('.ant-alert-message').should('exist');
  });

  it('It should accept the mail modal in use and correct the mail', () => {
    cy.get('input[type=email]').type(usedEmail);
    cy.get('input[type=password]').type(clave);
    cy.get('#names').type(nombre + ' ' + apellido);
    cy.get('#btnnextRegister').click();

    cy.get('input[type=email]')

      .clear()
      .type(email);
    cy.get('#btnnextRegister').should('not.be.disabled');
  });

  it('I should do the registration', () => {
    const filePath = 'mocion.jpg';
    cy.get("input[type='file']").attachFile(filePath);
    cy.contains('OK').click();
    cy.wait(1000);
    cy.get('input[type=email]').type(email);
    cy.get('input[type=password]').type(clave);
    cy.get('#names').type(nombre + ' ' + apellido);
    cy.get('#btnnextRegister').should('not.be.disabled');
    cy.get('#btnnextRegister').click();
    cy.wait(1000);
    //cy.contains('Datos del usuario').should('exist');
    cy.contains(nombre + ' ' + apellido).should('exist');
    cy.contains(email).should('exist');
    cy.get('#btnnextRegister').click();
    cy.wait(4000);
    cy.get('.ant-result-title').should('exist');
    cy.get('.ant-typography.ant-typography-secondary').should('exist');
    cy.wait(15000);

    cy.logout();
  });
  it('should log in with the new user', () => {
    cy.changeLogin();
    cy.login(email, clave);
    cy.logout();
  });
});
