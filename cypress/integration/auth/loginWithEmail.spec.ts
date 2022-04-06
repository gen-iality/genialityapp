///<reference types="cypress" />

describe('Login Action', () => {
  const email = 'cypressPruebas@mocionsoft.com';

  var linkLogin: string;
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
    cy.contains('Eventos');
  });

  it('Deberia mostrar el modal de login', () => {
    cy.contains('Iniciar sesión').click();
    cy.contains('Iniciar sesión solo con mi correo').should('exist');
  });
  it('Deberia mostrar el modal de iniciar sesión con correo', () => {
    cy.contains('Iniciar sesión').click();
    cy.contains('Iniciar sesión solo con mi correo').click();
    cy.get('#submitButton').should('exist');
  });
  it('No deberia enviar el acceso a mi correo porque el input no es un correo', () => {
    cy.contains('Iniciar sesión').click();
    cy.contains('Iniciar sesión solo con mi correo').click();
    cy.wait(1000);
    cy.get('input[type=email]')
      .eq(2)
      .type('cristian');
    cy.wait(1000);
    cy.contains('Ingrese un correo válido').should('exist');
  });
  it.only('Deberia aparecer la alerta de correo enviado', () => {
    cy.contains('Iniciar sesión').click();
    cy.contains('Iniciar sesión solo con mi correo').click();
    cy.wait(1000);
    cy.get('input[type=email]')
      .eq(2)
      .type(email);
    cy.get('button[type=submit]')
      .eq(2)
      .click();
    cy.wait(1000);
    cy.get('.ant-alert-message').should('exist');
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
    });
  });
  it.only('Deberia hacer el login usando el correo', () => {
    cy.forceVisit(linkLogin);
    //   cy.get('.ant-dropdown-trigger')
    //   .eq(0)
    //   .trigger('mouseover');
    // cy.contains('Administración').should('exist');
    // cy.wait(10000);
  });
});
