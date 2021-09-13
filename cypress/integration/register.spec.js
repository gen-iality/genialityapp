const urlToTest = '/landing/5fa9a9431cd0d1074b1e9242/evento';

describe('Evius Initial', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit(`${urlToTest}`);
  });

  it('User can register', () => {
  
  });
});
