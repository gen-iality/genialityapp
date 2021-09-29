
const urlToTest = 'localhost:3000/landing/5ea23acbd74d5c4b360ddde2/evento';

/*describe('Evius Initial', () => {
  beforeEach(() => {
    cy.visit(`${urlToTest}`);
  });

  it('User can register', () => {
    cy.fixture('fakeuser.json').then((userfake) => {
      cy.registerUser(userfake).then(() => {
        cy.contains('Registro Exitoso')
      });
    })
    
  });
});*/

describe("login",()=>{
  beforeEach(() => {
    cy.visit(`${urlToTest}`);
  });
  //USUARIO NO LOGUEADO
  it('User not logged', () => {
    cy.contains('Iniciar sesión');
    cy.contains('Registrarme');    
  })
  //USUARIO LOGUEADO
  it('logged in', () => {
    cy.get("#email").type("evius@evius.co");
    cy.get("#password").type("mocion2040");
    cy.get("#login").click();
    cy.wait(3000);
    cy.contains("EviusCo");
  })

   //USUARIO LOGUEADO
   it.only('forgot password user registered', () => {
    cy.contains("Olvidé mi contraseña").click()
    cy.get("#email").type("jaimedaniel.bm91@gmail.com");
    cy.get("#submitButton").click()
    cy.wait(2000);
    cy.contains("Se ha enviado una nueva contraseña a: jaimedaniel.bm91@gmail.com");
  })

  it('forgot password user not registered', () => {
    cy.contains("Olvidé mi contraseña").click()
    cy.get("#email").type("jaimedaniel_bm91@gmnail.com");
    cy.get("#submitButton").click()
    cy.wait(2000);
    cy.contains("Este email no se encuentra registrado en este evento");
  })
})