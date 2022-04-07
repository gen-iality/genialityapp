describe('Register User in Event', () => {
  const eventToTest = '/landing/624362c612e3604d37212ed3/evento';
  const stagingUrl = 'https://staging.evius.co';
  const localUrl = 'http://localhost:3000';
  const email = 'mario.montero@mocionsoft.com';
  const emailCypress = 'pruebasCypress01@mocionsoft.com';
  const clave = 'mocion.2040';
  const nombre = 'Mario Montero';
  const apellido = 'Montero';
  const telefono = '12345678';
  const celular = '12345678';
  const pais = 'Colombia';
  const ciudad = 'Bogota';
  const direccion = 'Calle 1';
  const codigoPostal = '12345';
  const nombreEmpresa = 'MocionSoft';
  const cargo = 'Arquitecto';
  var token = '';
  var id = '';
  var eventUserID = '';

  beforeEach(() => {
    if (process.env.NODE_ENV === 'production') {
      cy.visit(`${stagingUrl}${eventToTest}`);
    } else {
      cy.visit(`${localUrl}${eventToTest}`);
    }
  });

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
      url: `https://devapi.evius.co/auth/currentUser?token=${token}`,

      headers: {
        accept: 'application/json',
      },
    }).then((response) => {
      id = response.body._id;
    });
  });
  it.only('Deberia obtener el eventUserId del usuario', () => {
    cy.request({
      method: 'GET',
      url: `https://devapi.evius.co/api/me/events/624362c612e3604d37212ed3/eventusers?token=${token}`,

      headers: {
        accept: 'application/json',
      },
    }).then((response) => {
      eventUserID = response.body._id;
    });
  });

  it.only('Deberia eliminar el usuario del envento', () => {
    cy.request({
      method: 'DELETE',
      url: `https://devapi.evius.co/api/events/624362c612e3604d37212ed3/eventusers/${eventUserID}?token=${token}`,
      headers: {
        accept: 'application/json',
      },
    }).then((response) => {
      console.log(response.body);
    });
  });
  it.only('Deberia eliminar el usuario ', () => {
    cy.request({
      method: 'DELETE',
      url: `https://devapi.evius.co/api/users/${id}?token=${token}`,

      headers: {
        accept: 'application/json',
      },
    }).then((response) => {
      console.log(response.body);
    });
    console.log(token);
    console.log(id);
    console.log(eventUserID);
  });
  it('it should show the registration modal', () => {
    cy.contains('Registrarme').should('exist');
    cy.contains('Correo electrónico').should('exist');
    cy.contains('Contraseña').should('exist');
    cy.contains('Nombre completo').should('exist');
    cy.get('#btnnextRegister').should('be.disabled');
  });
  it('It should not allow registration, because the fields are empty', () => {
    cy.get('#email').should('be.empty');
    cy.get('#password').should('be.empty');
    cy.get('#names').should('be.empty');
    cy.get('#btnnextRegister').should('be.disabled');
  });
  it('It should not allow registration, because the fields are empty and the email is invalid', () => {
    cy.contains('Registrarme').should('exist');
    cy.wait(5000);
    cy.get('input[type=email]')
      .eq(1)
      .type(apellido);

    cy.contains('Ingrese un email valido').should('exist');
    cy.get('#password').should('be.empty');
    cy.get('#names').should('be.empty');
    cy.get('#btnnextRegister').should('be.disabled');
  });
  it('It should not allow registration, because the Full name and password fields are empty', () => {
    cy.get('input[type=email]')
      .eq(1)
      .type(email);
    cy.get('#password').should('be.empty');
    cy.get('#names').should('be.empty');
    cy.get('#btnnextRegister').should('be.disabled');
  });
  it('It should not allow registration, because the password field has a length less than 6 and the Full Name field is empty', () => {
    cy.get('input[type=email]')
      .eq(1)
      .type(email);
    cy.get('input[type=password]')
      .eq(1)
      .type('2323');
    cy.get('#names').should('be.empty');
    cy.get('#btnnextRegister').should('be.disabled');
    cy.contains('La contraseña debe tener entre 6 a 18 caracteres').should('exist');
  });
  it('It should not allow registration, the Full Name field is empty', () => {
    cy.get('input[type=email]')
      .eq(1)
      .type(email);
    cy.get('input[type=password]')
      .eq(1)
      .type(clave);
    cy.get('#names').should('be.empty');
    cy.get('#btnnextRegister').should('be.disabled');
  });
  it('It should not allow registration because the mail is in use', () => {
    cy.get('input[type=email]')
      .eq(1)
      .type(email);
    cy.get('input[type=password]')
      .eq(1)
      .type(clave);
    cy.get('#names').type(nombre + ' ' + apellido);
    cy.get('#btnnextRegister').should('not.be.disabled');
    cy.get('#btnnextRegister').click();
    cy.wait(1000);
    cy.get('.ant-alert-message').should('exist');
  });

  it('It should accept the mail modal in use and correct the mail', () => {
    cy.get('input[type=email]')
      .eq(1)
      .type(email);
    cy.get('input[type=password]')
      .eq(1)
      .type(clave);
    cy.get('#names').type(nombre + ' ' + apellido);
    cy.get('#btnnextRegister').click();

    cy.get('input[type=email]')
      .eq(1)
      .clear()
      .type(emailCypress);
    cy.get('#btnnextRegister').should('not.be.disabled');
  });

  it.only('I should do the registration', () => {
    const filePath = 'mocion.jpg';
    cy.get("input[type='file']").attachFile(filePath);
    cy.contains('OK').click();
    cy.wait(1000);
    cy.get('input[type=email]')
      .eq(1)
      .type(emailCypress);
    cy.get('input[type=password]')
      .eq(1)
      .type(clave);
    cy.get('#names').type(nombre + ' ' + apellido);
    cy.get('#btnnextRegister').should('not.be.disabled');
    cy.get('#btnnextRegister').click();
    cy.wait(1000);
    cy.contains('Datos del usuario').should('exist');
    cy.contains(nombre + ' ' + apellido).should('exist');
    cy.contains(emailCypress).should('exist');
    cy.get('#btnnextRegister').click();
    cy.wait(4000);
    cy.contains('¡Registro exitoso!').should('exist');
    cy.contains('Iniciando sesión con tu cuenta!').should('exist');
    cy.wait(15000);
    cy.get('.ant-modal-body')
      .contains('Inscribirme al evento')
      .click();
    cy.wait(15000);
    cy.get('.ant-dropdown-trigger')
      .eq(0)
      .trigger('mouseover');
    cy.contains('Administración').should('exist');
    cy.contains('Cerrar sesión').click();
    cy.wait(2000);
    cy.contains('Si, cerrar la sesión').click();
    cy.wait(5000);
  });
});
