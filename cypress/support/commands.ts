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
      visitEvent(): Cypress.Chainable<Element>;
      logoutWithOutEvent(): Cypress.Chainable<Element>;
    }
  }
}
const eventToTest = '/landing/624362c612e3604d37212ed3/evento';
const stagingUrl = 'https://staging.evius.co';
const localUrl = 'http://localhost:3000';

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
