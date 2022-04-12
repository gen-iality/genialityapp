/// <reference types="cypress" />
describe('Register User in Event', () => {
  const email = 'pruebascypress137@mocionsoft.com';
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
    cy.contains('Registrarme').should('exist');
    cy.contains('Correo electrónico').should('exist');
    cy.contains('Contraseña').should('exist');
    cy.contains('Nombre completo').should('exist');
    cy.get('#btnnextRegister').should('be.disabled');
  });
  it('It should not allow registration, because the fields are empty', () => {
    cy.get('#email').should('be.empty');
    cy.get('#password').should('be.empty');
    cy.get('#names').should('be.empty');
    cy.get('#btnnextRegister').should('be.disabled');
  });
  it('It should not allow registration, because the fields are empty and the email is invalid', () => {
    cy.contains('Registrarme').should('exist');
    cy.wait(5000);
    cy.get('input[type=email]')
      .eq(1)
      .type(apellido);

    cy.contains('Ingrese un email valido').should('exist');
    cy.get('#password').should('be.empty');
    cy.get('#names').should('be.empty');
    cy.get('#btnnextRegister').should('be.disabled');
  });
  it('It should not allow registration, because the Full name and password fields are empty', () => {
    cy.get('input[type=email]')
      .eq(1)
      .type(email);
    cy.get('#password').should('be.empty');
    cy.get('#names').should('be.empty');
    cy.get('#btnnextRegister').should('be.disabled');
  });
  it('It should not allow registration, because the password field has a length less than 6 and the Full Name field is empty', () => {
    cy.get('input[type=email]')
      .eq(1)
      .type(email);
    cy.get('input[type=password]')
      .eq(1)
      .type('2323');
    cy.get('#names').should('be.empty');
    cy.get('#btnnextRegister').should('be.disabled');
    cy.contains('La contraseña debe tener entre 6 a 18 caracteres').should('exist');
  });
  it('It should not allow registration, the Full Name field is empty', () => {
    cy.get('input[type=email]')
      .eq(1)
      .type(email);
    cy.get('input[type=password]')
      .eq(1)
      .type(clave);
    cy.get('#names').should('be.empty');
    cy.get('#btnnextRegister').should('be.disabled');
  });
  it('It should not allow registration because the mail is in use', () => {
    cy.get('input[type=email]')
      .eq(1)
      .type(usedEmail);
    cy.get('input[type=password]')
      .eq(1)
      .type(clave);
    cy.get('#names').type(nombre + ' ' + apellido);
    cy.get('#btnnextRegister').should('not.be.disabled');
    cy.get('#btnnextRegister').click();
    cy.wait(1000);
    cy.get('.ant-alert-message').should('exist');
  });

  it('It should accept the mail modal in use and correct the mail', () => {
    cy.get('input[type=email]')
      .eq(1)
      .type(usedEmail);
    cy.get('input[type=password]')
      .eq(1)
      .type(clave);
    cy.get('#names').type(nombre + ' ' + apellido);
    cy.get('#btnnextRegister').click();

    cy.get('input[type=email]')
      .eq(1)
      .clear()
      .type(email);
    cy.get('#btnnextRegister').should('not.be.disabled');
  });

  it('I should do the registration', () => {
    const filePath = 'mocion.jpg';
    cy.get("input[type='file']").attachFile(filePath);
    cy.contains('OK').click();
    cy.wait(1000);
    cy.get('input[type=email]')
      .eq(1)
      .type(email);
    cy.get('input[type=password]')
      .eq(1)
      .type(clave);
    cy.get('#names').type(nombre + ' ' + apellido);
    cy.get('#btnnextRegister').should('not.be.disabled');
    cy.get('#btnnextRegister').click();
    cy.wait(1000);
    cy.contains('Datos del usuario').should('exist');
    cy.contains(nombre + ' ' + apellido).should('exist');
    cy.contains(email).should('exist');
    cy.get('#btnnextRegister').click();
    cy.wait(4000);
    cy.contains('¡Registro exitoso!').should('exist');
    cy.contains('Iniciando sesión con tu cuenta!').should('exist');
    cy.wait(15000);
    //este prueba puede falla si no aparece el modal de incripcopn
    if (cy.get('.ant-modal-body')) {
      cy.get('.ant-modal-body') // Si aparce el modal de insicirbir al evento
        .contains('Inscribirme al evento')
        .click();
    }
    cy.logout();
  });
  it('should log in with the new user', () => {
    cy.changeLogin();
    cy.login(email, clave);
    cy.logout();
  });
});
