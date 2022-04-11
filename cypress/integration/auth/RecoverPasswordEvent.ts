describe('Recover Password in Event', () => {
  const eventToTest = '/landing/624362c612e3604d37212ed3/evento';
  const stagingUrl = 'https://staging.evius.co';
  const localUrl = 'http://localhost:3000';
  const event_id = '624362c612e3604d37212ed3';
  const email = 'cristian.florez@mocionsoft.com';
  const emailCypress = 'pruebasCypress01@mocionsoft.com';
  const nombre = 'Mario Montero';
  const newPassword = 'mocion.2041';
  let resetLink = '';
  beforeEach(() => {
    if (process.env.NODE_ENV === 'production') {
      cy.visit(`${stagingUrl}${eventToTest}`);
    } else {
      cy.visit(`${localUrl}${eventToTest}`);
    }
  });
  it('It should show the login modal and switch to the login form and open modal recover ', () => {
    cy.wait(5000);
    cy.get('.ant-modal-body').should('exist');
    cy.contains('Registrarme').should('exist');
    cy.get('#rc-tabs-0-tab-login').click();
    cy.contains('Olvidé mi contraseña').click();
  });
  it('it should not send the reset email because the field is empty', () => {
    cy.wait(5000);
    cy.get('.ant-modal-body').should('exist');
    cy.contains('Registrarme').should('exist');
    cy.get('#rc-tabs-0-tab-login').click();
    cy.contains('Olvidé mi contraseña').click();
    cy.get('#email').should('be.empty');
    cy.get('button[type=submit]')
      .eq(3)
      .click();
    cy.contains('El correo es requerido').should('exist');
  });
  it('it should not send the reset email because the email field does not meet the parameters of type email', () => {
    cy.wait(5000);
    cy.get('.ant-modal-body').should('exist');
    cy.contains('Registrarme').should('exist');
    cy.get('#rc-tabs-0-tab-login').click();
    cy.contains('Olvidé mi contraseña').click();
    cy.wait(1000);
    cy.get('input[type=email]')
      .eq(4)
      .type(nombre);
    cy.wait(1000);
    cy.contains('Ingrese un correo válido').should('exist');
  });
  it('The unregistered mail alert should appear', () => {
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
  it.only('The email sent alert should appear', () => {
    cy.wait(5000);
    cy.get('.ant-modal-body').should('exist');
    cy.contains('Registrarme').should('exist');
    cy.get('#rc-tabs-0-tab-login').click();
    cy.contains('Olvidé mi contraseña').click();
    cy.wait(1000);
    cy.get('input[type=email]')
      .eq(4)
      .type(email);
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
      cy.wait(2000);
      cy.contains('Cerrar sesión').click();
      cy.wait(2000);
      cy.contains('Si, cerrar la sesión').click();
      cy.wait(5000);
    });
  });
});
