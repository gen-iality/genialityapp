describe('Recover Password in Event', () => {
  const event_id = '624362c612e3604d37212ed3';
  const email = 'pruebascypress@mocionsoft.com';
  const emailNoFound = 'pruebascypress001@mocionsoft.com';
  const nombre = 'Mario Montero';
  const newPassword = 'mocion.2041';
  let resetLink = '';
  beforeEach(() => {
    switch (Cypress.currentTest.title) {
      case 'it should change the password and log in with the new password':
        cy.log('it should change the password and log in with the new password');
        break;
      default:
        cy.visitEvent();
        break;
    }
  });
  it('It should show the login modal and switch to the login form and open modal recover ', () => {
    cy.changeLogin();
    cy.contains('Olvidé mi contraseña').click();
  });
  it('it should not send the reset email because the field is empty', () => {
    cy.changeLogin();
    cy.contains('Olvidé mi contraseña').click();
    cy.get('#email').should('be.empty');
    cy.get('button[type=submit]')
      .eq(3)
      .click();
    cy.contains('El correo es requerido').should('exist');
  });
  it('it should not send the reset email because the email field does not meet the parameters of type email', () => {
    cy.changeLogin();
    cy.contains('Olvidé mi contraseña').click();
    cy.wait(1000);
    cy.get('input[type=email]')
      .eq(4)
      .type(nombre);
    cy.wait(1000);
    cy.contains('Ingrese un correo válido').should('exist');
  });
  it('The unregistered mail alert should appear', () => {
    cy.changeLogin();
    cy.contains('Olvidé mi contraseña').click();
    cy.wait(1000);
    cy.get('input[type=email]')
      .eq(4)
      .type(emailNoFound);
    cy.get('button[type=submit]')
      .eq(3)
      .click();
    cy.wait(3000);
    cy.get('.ant-alert-message').should('exist');
  });
  it('The email sent alert should appear', () => {
    cy.changeLogin();
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
  it('it should change the password and log in with the new password', () => {
    cy.request({
      method: 'PUT',
      url: `https://devapi.evius.co/api/changeuserpassword`,
      body: {
        email: email,
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
      cy.changeLogin();
      cy.login(email, newPassword);
      cy.wait(5000);
      cy.logout();
      cy.wait(5000);
    });
  });
});
