const urlToTest = '/landing/5fa9a9431cd0d1074b1e9242/evento';

describe('Evius Initial', () => {
  beforeEach(() => {
    cy.visit(`${urlToTest}`);
  });

  it('User can register', () => {
    cy.fixture('fakeuser.json').then((userfake) => {
      cy.registerUser(userfake).then(() => {
        cy.contains('Registro Exitoso');
      });
    });
  });
});
