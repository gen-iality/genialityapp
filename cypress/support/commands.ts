// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import 'cypress-file-upload';

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Provides a working example
       */
      forceVisit(url: any): Cypress.Chainable<Element>;
      logout(): Cypress.Chainable<Element>;
      login(email: string, password: string): Cypress.Chainable<Element>;
      changeLogin(): Cypress.Chainable<Element>;
      changeLoginEvent(): Cypress.Chainable<Element>;
      visitEvent(): Cypress.Chainable<Element>;
      logoutWithOutEvent(): Cypress.Chainable<Element>;
      generateEmail(baseEmail: any): Cypress.Chainable<Element>;
      registerUser(email: string, password: string): Cypress.Chainable<Element>;
      logoutWithEvent(): Cypress.Chainable<Element>;
      fillEventFields(): Cypress.Chainable<Element>;
      correctFields(): Cypress.Chainable<Element>;
      openUserMenu(): Cypress.Chainable<Element>;
      editRegistryInformation(email: string): Cypress.Chainable<Element>;
    }
  }
}
const eventToTest = '/landing/624362c612e3604d37212ed3/evento';
const stagingUrl = 'https://staging.evius.co';
const localUrl = 'http://localhost:3000';
const nombre = 'Pruebas';
const apellido = 'Cypress';
const uuid = () => Cypress._.random(0, 1e9).toString(36);
const id = uuid();
Cypress.Commands.add('forceVisit', (url) => {
  cy.window().then((win) => {
    return win.open(url, '_self');
  });
});
Cypress.Commands.add('logout', () => {
  cy.wait(1000);
  cy.get('.ant-dropdown-trigger')
    .eq(0)
    .trigger('mouseover');
  cy.get('.ant-dropdown-menu-item-group-title').should('exist');
  cy.wait(2000);

  cy.get('.ant-dropdown-menu-title-content')
    .eq(6)
    .click();
  cy.wait(2000);
  cy.get('button')
    .should('have.class', 'ant-btn ant-btn-default ant-btn-dangerous')
    .eq(5)
    .click();
  cy.wait(5000);
});
Cypress.Commands.add('logoutWithOutEvent', () => {
  cy.wait(1000);
  cy.get('.ant-dropdown-trigger')
    .eq(0)
    .trigger('mouseover');
  cy.get('.ant-dropdown-menu-item-group-title').should('exist');
  cy.wait(2000);

  cy.get('.ant-dropdown-menu-title-content')
    .eq(5)
    .click();
  cy.wait(2000);
  cy.get('button')
    .should('have.class', 'ant-btn ant-btn-default ant-btn-dangerous')
    .eq(5)
    .click();
  cy.wait(5000);
});

Cypress.Commands.add('changeLogin', () => {
  cy.wait(4000);
  cy.get('.ant-modal-body').should('exist');
  cy.get('#rc-tabs-0-tab-register').should('exist');
  cy.get('#rc-tabs-0-tab-login').click();
});
Cypress.Commands.add('changeLoginEvent', () => {
  cy.wait(4000);
  cy.get('.ant-modal-body').should('exist');
  cy.get('#rc-tabs-1-tab-register').should('exist');
  cy.get('#rc-tabs-1-tab-login').click();
});
Cypress.Commands.add('login', (email, password) => {
  cy.get('#email').type(email);
  cy.get('#password').type(password);
  cy.get('#loginButton').click();
});
Cypress.Commands.add('visitEvent', () => {
  // if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  //   cy.visit(`${stagingUrl}${eventToTest}`);
  // } else if (process.env.NODE_ENV === 'development') {
  //   cy.visit(`${localUrl}${eventToTest}`);
  // }
  cy.visit(`${stagingUrl}${eventToTest}`);
});
Cypress.Commands.add('registerUser', (email, clave) => {
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
  // cy.contains(email).should('exist');
  cy.get('#cedula').type('123456789');
  cy.get('#codigoDeArea').type('+57');
  cy.get('#telefono').type('300 555 5555');
  cy.get('#pais').select('Colombia');
  cy.get('#ciudad').select('Bogotá D.C.');
  cy.get('#btnnextRegister').click();
  cy.wait(4000);
  cy.get('.ant-result-title').should('exist');
  cy.get('.ant-typography.ant-typography-secondary').should('exist');
  cy.wait(15000);
});
Cypress.Commands.add('logoutWithEvent', () => {
  cy.get('.ant-dropdown-trigger')
    .eq(0)
    .trigger('mouseover');
  cy.get('.ant-dropdown-menu-item-group-title').should('exist');
  cy.wait(2000);

  cy.get('.ant-dropdown-menu-title-content')
    .eq(6)
    .click();
  cy.wait(2000);
  cy.get('button')
    .should('have.class', 'ant-btn ant-btn-default ant-btn-dangerous')
    .eq(4)
    .click();
});

Cypress.Commands.add('fillEventFields', () => {
  cy.get('#cedula').type('123456789');
  cy.get('#codigoDeArea').type('+57');
  cy.get('#telefono').type('300 555 5555');
  cy.get('#pais').select('Colombia');
  cy.get('#ciudad').select('Bogotá D.C.');
});

Cypress.Commands.add('correctFields', () => {
  cy.get('#cedula')
    .clear()
    .type('235235532');
  cy.get('#codigoDeArea')
    .clear()
    .type('+57');
  cy.get('#telefono')
    .clear()
    .type('300 978 5555');

  cy.get('#ciudad').select('Atlántico');
  cy.get("button[type='submit']").click();
  cy.wait(2000);
});
Cypress.Commands.add('openUserMenu', () => {
  cy.get('.ant-dropdown-trigger')
    .eq(0)
    .trigger('mouseover');
  cy.get('.ant-dropdown-menu-item-group-title').should('exist');
  cy.wait(2000);
});

Cypress.Commands.add('editRegistryInformation', (emailNoRegister) => {
  cy.wait(2000);
  cy.openUserMenu();
  cy.get('.ant-dropdown-menu-title-content')
    .eq(0)
    .click();
  cy.wait(2000);
  cy.get('.ant-btn.ant-btn-text').click();
  cy.contains(emailNoRegister).should('exist');
  cy.correctFields();
  cy.openUserMenu();
  cy.get('.ant-dropdown-menu-title-content')
    .eq(6)
    .click();
  cy.wait(2000);
  cy.get('button')
    .should('have.class', 'ant-btn ant-btn-default ant-btn-dangerous')
    .eq(6)
    .click();
});

/// agregar este comando de eliminar

/* 

 it.only('Deberia obtener el token del usuario', () => {
    cy.request({
      method: 'POST',
      url:
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAohyXq3R4t3ao7KFzLDY7W6--g6kOuS7Q',
      body: {
        email: emailCypress,
        password: clave,
        returnSecureToken: true,
      },
      headers: {
        accept: 'application/json',
      },
    }).then((response) => {
      token = response.body.idToken;
    });
  });

  it.only('Deberia obtener el id del usuario', () => {
    cy.request({
      method: 'GET',
      url: `https://devapi.evius.co/auth/currentUser?evius_token=${token}`,

      headers: {
        accept: 'application/json',
      },
    }).then((response) => {
      id = response.body._id;
      console.log(response.body._id);
      cy.log(id);
    });
  });

*/
