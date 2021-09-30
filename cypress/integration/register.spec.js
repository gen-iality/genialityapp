const urlToTest = '/landing/5ea23acbd74d5c4b360ddde2/evento';

describe('Evius Initial', () => {
  beforeEach(() => {
    cy.visit(`${urlToTest}`);
  });

  it('User can register', () => {
    cy.get('#rc-tabs-0-tab-2').click();
    cy.fixture('fakeuser.json').then((userfake) => {
      cy.registerUser(userfake);
      cy.get('#register').click({ force: true });
      cy.wait(3000);
      //DESCOMENTAR Y CAMBIAR FAKE USER PARA NUEVOS REGISTROS
     // cy.contains('Registro Exitoso')
      cy.get('.ant-alert-warning');
    });
  });

  /*it('User can not register', () => {
    cy.contains('Registrarme').click();
    cy.fixture('fakeuser.json').then((userfake) => {
      cy.registerUser(userfake);
      cy.get('#register').click({ force: true });
      cy.wait(2000);
      cy.contains('Ya se encuentra registrado.');
    });
  });*/
});

describe('login', () => {
  beforeEach(() => {
    cy.visit(`${urlToTest}`);
  });
  //USUARIO NO LOGUEADO
  it('User not logged', () => {
    cy.get('#rc-tabs-0-tab-1');
    cy.get('#rc-tabs-0-tab-2');
  });
  //USUARIO LOGUEADO
  it('logged in', () => {
    cy.clearCookies()
    cy.get('#email').type('jaimedaniel.bm91@gmail.com');
    cy.get('#password').type('j1234567');
    cy.get('#loginButton').click();
    cy.wait(15000);
    cy.contains('Jsoft');
  });

  //RECUPERAR CONTRASEÑA DESCOMENTAR PARA PROBAR RECUPERAR CONTRASEÑA
  /*it('forgot password user registered', () => {
    cy.contains('Olvidé mi contraseña').click();
    cy.get('#email').type('jaimedaniel.bm91@gmail.com');
    cy.get('#submitButton').click();
    cy.wait(2000);
    cy.contains('Se ha enviado una nueva contraseña a: jaimedaniel.bm91@gmail.com');
  });*/

  it('forgot password user not registered', () => {
    cy.contains('Olvidé mi contraseña').click();
    cy.get('#email').type('jaimedaniel_bm91@gmnail.com');
    cy.get('#submitButton').click();
    cy.wait(2000);
    cy.get('.ant-alert-error');
  });
});
