describe('Register User in Event', () => {
  const eventToTest = '/landing/624362c612e3604d37212ed3/evento';
  const stagingUrl = 'https://staging.evius.co';
  const localUrl = 'http://localhost:3000';
  const email = 'mario.montero@mocionsoft.com';
  const clave = 'mocion.2040';
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

  beforeEach(() => {
    if (process.env.NODE_ENV === 'production') {
      cy.visit(`${stagingUrl}${eventToTest}`);
    } else {
      cy.visit(`${localUrl}${eventToTest}`);
    }
  });

  it('Filled Fields ', () => {
    cy.get('#email')
      .click()
      .type(email);
    cy.get('#password').type(clave);
  });
});
