///<reference types="cypress" />

describe('Register Action', () => {
  var token: string;
  const email = 'cypressPruebas@mocionsoft.com';
  const password = 'pruebasCypress';
  var id = '';
  //   beforeEach(() => {
  //     cy.visit('http://localhost:3000/');
  //     cy.contains('Eventos');
  //     cy.contains('Registrarme').click();
  //   });
  //   it('No deberia permitir el registro, por que los campos estan vacios ', () => {
  //     cy.contains('Crear cuenta de usuario').click();
  //     cy.contains('Ingrese un email para su cuenta en Evius').should('exist');
  //     cy.contains('Ingrese una contraseña para su cuenta en Evius').should('exist');
  //     cy.contains('Ingrese su nombre completo para su cuenta en Evius').should('exist');
  //   });
  //   it('No deberia permitir el registro, por que los campos estan vacios y el correo es invalido', () => {
  //     cy.get('#email').type('cristian.florez');
  //     cy.get('#email').click();
  //     cy.contains('Crear cuenta de usuario').click();
  //     cy.contains('Ingrese un email valido').should('exist');
  //     cy.get('#password').should('be.empty');
  //     cy.get('#names').should('be.empty');
  //   });
  //   it('No deberia permitir el registro, por que los campos Nombre completo y contraseña estan vacios', () => {
  //     cy.get('#email').type('cristian.florez@mocionsoft.com');
  //     cy.contains('Crear cuenta de usuario').click();
  //     cy.contains('Ingrese una contraseña para su cuenta en Evius').should('exist');
  //     cy.contains('Ingrese su nombre completo para su cuenta en Evius').should('exist');
  //   });
  //   it('No deberia permitir el registro, por que el campo contraseña tiene una longitud menor a 6 y el campo Nombre completo esta vacio', () => {
  //     cy.get('#email').type('cristian.florez@mocionsoft.com');
  //     cy.get('#password').type('2323');
  //     cy.contains('Crear cuenta de usuario').click();
  //     cy.contains('La contraseña debe tener entre 6 a 18 caracteres').should('exist');
  //     cy.contains('Ingrese su nombre completo para su cuenta en Evius').should('exist');
  //   });
  //   it('No deberia permitir el registro, el campo Nombre completo esta vacio', () => {
  //     cy.get('#email').type('cristian.florez@mocionsoft.com');
  //     cy.get('#password').type('12345678');
  //     cy.contains('Crear cuenta de usuario').click();
  //     cy.contains('Ingrese su nombre completo para su cuenta en Evius').should('exist');
  //   });
  //   it('No deberia permitir el registro por que el correo esta en uso', () => {
  //     cy.get('#email').type('cristian.florez@mocionsoft.com');
  //     cy.get('#password').type('12345678');
  //     cy.get('#names').type('Cristian Florez');
  //     cy.contains('Crear cuenta de usuario').click();
  //   });
  //   it('Deberia aceptar el modal de correo en uso y corregir el correo', () => {
  //     cy.get('#email').type('cristian.florez@mocionsoft.com');
  //     cy.get('#password').type('12345678');
  //     cy.get('#names').type('Cristian Florez');
  //     cy.contains('Crear cuenta de usuario').click();
  //     cy.contains('Aceptar').click();
  //     cy.get('#email')
  //       .clear()
  //       .type(email);
  //   });
  //   it('Deberia permitir el regsitro del usuario sin foto ', () => {
  //     cy.get('#email').type(email);
  //     cy.get('#password').type(password);
  //     cy.get('#names').type('Cypress Test');
  //     cy.contains('Crear cuenta de usuario').click();
  //     cy.contains('Aceptar').click();
  //     cy.get('.ant-dropdown-trigger')
  //       .eq(0)
  //       .trigger('mouseover');
  //     cy.contains('Administración').should('exist');
  //     cy.contains('Cerrar sesión').click();
  //     cy.contains('Si, cerrar la sesión').click();
  //   });
  it('Deberia obtener el token del usuario', () => {
    cy.request({
      method: 'POST',
      url:
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAohyXq3R4t3ao7KFzLDY7W6--g6kOuS7Q',
      body: {
        email: email,
        password: password,
        returnSecureToken: true,
      },
      headers: {
        accept: 'application/json',
      },
    }).then((response) => {
      token = response.body.idToken;
    });
  });

  it('Deberia obtener el id del usuario', () => {
    cy.request({
      method: 'GET',
      url: `https://devapi.evius.co/auth/currentUser?token=${token}`,

      headers: {
        accept: 'application/json',
      },
    }).then((response) => {
      id = response.body._id;
    });
  });
  it('Deberia eliminar el usario', () => {
    cy.request({
      method: 'DELETE',
      url: `https://devapi.evius.co//api/users/${id}?token=${token}`,
      headers: {
        accept: 'application/json',
      },
    }).then((response) => {
      cy.log(response.body);
    });
  });
  it('Use the token here', () => {
    cy.log(token);
    cy.log(id);
    //prints token
    //use token here
  });
  //   it.only('Deberia permitir el regsitro del usuario con foto', () => {
  //     const filePath = 'mocion.jpg';
  //     cy.get("input[type='file']").attachFile(filePath);
  //     cy.contains('OK').click();
  //     cy.get('#email').type(email);
  //     cy.get('#password').type(password);
  //     cy.get('#names').type('Cypress Test');
  //     cy.contains('Crear cuenta de usuario').click();
  //     cy.wait(4000);
  //     cy.contains('Aceptar').click();
  //     cy.get('.ant-dropdown-trigger')
  //       .eq(0)
  //       .trigger('mouseover');
  //     cy.contains('Administración').should('exist');
  //     cy.contains('Cerrar sesión').click();
  //     cy.contains('Si, cerrar la sesión').click();
  //   });
});
