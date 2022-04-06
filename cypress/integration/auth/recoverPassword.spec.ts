///<reference types="cypress" />

describe('Recover Action', () => {
  const email = 'cypressPruebas@mocionsoft.com';
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
    cy.contains('Eventos');
  });

  it('Deberia mostra el modal de olvidar contraseñar', () => {
    cy.contains('Iniciar sesión').click();
    cy.contains('Olvidé mi contraseña').click();
  });
  it('No debe enviar le correo restablecmiento por que el campo esta vacio', () => {
    cy.contains('Iniciar sesión').click();
    cy.contains('Olvidé mi contraseña').click();
    cy.get('#email').should('be.empty');
    cy.get('button[type=submit]')
      .eq(2)
      .click();
    cy.contains('El correo es requerido').should('exist');
  });
  it('No debe enviar le correo restablecmiento por que el campo email no cumple con los parametros de typo email', () => {
    cy.contains('Iniciar sesión').click();
    cy.contains('Olvidé mi contraseña').click();
    cy.wait(1000);
    cy.get('input[type=email]')
      .eq(2)
      .type('cypressPruebas@sss');
    cy.wait(1000);
    cy.contains('Ingrese un correo válido').should('exist');
  });
  it('Deberia aparecer la alerta de correo no registrado', () => {
    cy.contains('Iniciar sesión').click();
    cy.contains('Olvidé mi contraseña').click();
    cy.wait(1000);
    cy.get('input[type=email]')
      .eq(2)
      .type('cypressNofound@mocionsoft.com');
    cy.get('button[type=submit]')
      .eq(2)
      .click();
    cy.wait(3000);
    cy.get('.ant-alert-message').should('exist');
  });
  it.only('Deberia aparecer la alerta del correo enviado', () => {
    cy.contains('Iniciar sesión').click();
    cy.contains('Olvidé mi contraseña').click();
    cy.wait(1000);
    cy.get('input[type=email]')
      .eq(2)
      .type('cristian.florez@mocionsoft.com');
    cy.get('button[type=submit]')
      .eq(2)
      .click();
    cy.wait(3000);
    cy.get('.ant-alert-message').should('exist');
  });
});
