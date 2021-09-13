const urlToTest = '/landing/5fa9a9431cd0d1074b1e9242/evento';

describe('Evius Initial', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit(`${urlToTest}`);
  });

  it('User can register', () => {
    let fakeuser = {
      email: 'fakeuser@gmail.com',
      name: 'fakeuser',
      phone: '57 4567849',
      address: 'my crazy direction',
      interested: 'Vender',
      economy_activity: 'whatever economy',
      description: 'whatever description',
      termsService: true,
    };
    cy.registerUser(fakeuser);
  });
});
