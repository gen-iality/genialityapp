///<reference types="cypress" />

describe('Login Action', () => {
  const email = 'cristian.florez@mocionsoft.com';
  const password = '1234567890@';
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
    cy.contains('Eventos');
  });

  it('Deberia mostrar el modal de login', () => {
    cy.contains('Iniciar sesión').click();
    cy.get('#loginButton').should('exist');
  });
  it('No deberia permitir el inicio de sesión, por que los campso correo y contraseña estan vacios', () => {
    cy.contains('Iniciar sesión').click();
    cy.get('#email').should('be.empty');
    cy.get('#password').should('be.empty');
    cy.get('#loginButton').click();
    cy.wait(1000);
    cy.contains('Ingrese un correo').should('exist');
    cy.contains('Ingrese una contraseña').should('exist');
  });
  it('No deberia permitir el inicio de sesión, por que el campo email no cumple con el formato y el campo contraseña esta vacio', () => {
    cy.contains('Iniciar sesión').click();
    cy.get('#email').type('correo');
    cy.get('#email').click();
    cy.get('#password').should('be.empty');
    cy.get('#loginButton').click();
  });
  it('No deberia permitir el inicio de sesión, por que el campo contraseña esta vacio', () => {
    cy.contains('Iniciar sesión').click();
    cy.get('#email').type('cristian.florez@gmail.com');
    cy.get('#password').should('be.empty');
    cy.get('#loginButton').click();
    cy.contains('Ingrese una contraseña').should('exist');
  });
  it('Deberia aparecer una alerta, por que el correo no existe', () => {
    cy.contains('Iniciar sesión').click();
    cy.get('#email').type('pruebasCypresss@mocionsoft.com');
    cy.get('#password').type('123456');
    cy.get('#loginButton').click();
    cy.wait(1000);
    cy.contains('este email no esta registrado').should('exist');
  });
  it('Deberia aparecer una alerta, por que la contraseña es incorrecta', () => {
    cy.contains('Iniciar sesión').click();
    cy.get('#email').type('cristian.florez@mocionsoft.com');
    cy.get('#password').type('123456');
    cy.get('#loginButton').click();
    cy.wait(1000);
    cy.contains('La contraseña es incorrecta').should('exist');
  });

  it.only('Deberia iniciar sesion en la plataforma', () => {
    cy.contains('Iniciar sesión').click();
    cy.get('#email').type(email);
    cy.get('#password').type(password);
    cy.get('#loginButton').click();
    cy.wait(1000);
    cy.get('.ant-dropdown-trigger')
      .eq(0)
      .trigger('mouseover');
    cy.contains('Administración').should('exist');
    cy.wait(10000);
  });
});
