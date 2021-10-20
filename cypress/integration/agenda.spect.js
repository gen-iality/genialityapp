const urlToTest = '/eventadmin/5ea23acbd74d5c4b360ddde2/agenda';

describe('Evius Agenda', () => {
  beforeEach(() => {
    cy.setCookie('evius_token', 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyYWZkYjliOGJmZmMyY2M4ZTU4NGQ2ZWE2ODlmYzEwYTg3MGI2NzgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZXZpdXNhdXRoIiwiYXVkIjoiZXZpdXNhdXRoIiwiYXV0aF90aW1lIjoxNjMxNTM2MTQzLCJ1c2VyX2lkIjoiODFYdERvWExCUFRWdDRTNjNaMjRMMDVScGcwMyIsInN1YiI6IjgxWHREb1hMQlBUVnQ0UzYzWjI0TDA1UnBnMDMiLCJpYXQiOjE2MzE1MzYxNDMsImV4cCI6MTYzMTUzOTc0MywiZW1haWwiOiJhbGVqYW5kcmEucGVyZG9tb0Btb2Npb25zb2Z0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhbGVqYW5kcmEucGVyZG9tb0Btb2Npb25zb2Z0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.kiEu3rTdKRqnbmmgc8Xt8uPTGyAOUOGt06myJrHD3jicyRwhXVglWxoOLlqbWYizVVesV1YIVV6xFEyiH_JUZbB8JBB8lkCYVtfD1H-ubmQPy9dBzF699lcZ-HCrL_D-xQRwxaKRozzYpMIlhuChl_k6bcnzAFkmY8loBP6kNj9PT5tB9dYXCbNHrS6K0M7e2hcVlcSVSEmP6_0350ntZyJiKV9wnoadx1XWAfeKtCnI902JcIdquaZz5-r-FPkkhMOstX68F8Kx-9UvCdzZKydN1nFHwXeKJ1c6ZIMxJmpV9VIbYd3ou_iu92Uzj943QGG-uS0mcIMzdc9D5VX6UQ')
    cy.visit(`${urlToTest}`);
  });

  it('Agenda Create', () => {
    cy.contains('Agregar').click()
    cy.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false
    })
    cy.get('[name=name]').type('Actividad Prueba') 
    cy.get('[name=subtitle]').type('Subtitulo Prueba') 
    cy.get('[name=date]').click().then(() => {
      cy.get('div[title="2021-09-08"]').click()
    })
    cy.fixture('BOTON_STANDS.png').as('logo')
    cy.get('input[type=file]').then(function (el) {
      const blob = Cypress.Blob.base64StringToBlob(this.logo, 'image/png')
    
      const file = new File([blob], this.logo, { type: 'image/png' })
      const list = new DataTransfer()
    
      list.items.add(file)
      const myFileList = list.files
    
      el[0].files = myFileList
      el[0].dispatchEvent(new Event('change', { bubbles: true }))
    })
    cy.get('[name=capacity]').type(400) 
    cy.contains('Guardar').click()
  });
  
  it('Agenda Edit', () => {
    cy.wait(500)
    cy.get('[id=editAction3]').click()
    cy.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false
    })
    cy.get('[name=name]').type('Actividad Prueba Editado')
    cy.get('[name=capacity]').clear() 
    cy.get('[name=capacity]').type(500) 
    cy.contains('Guardar').click()
  });

  it('Agenda see more', () => {
    cy.get('[id=editAction3]').click()
    cy.wait(800)
    cy.contains('Seleccion de lenguaje').click()
    cy.wait(500)
    cy.contains('Espacio Virtual').click()
    cy.wait(500)
    cy.contains('Avanzado')
  });
  
  it('Agenda cancel remove in table', () => {
    cy.get('[id=removeAction3]').click()
    cy.contains('Cancelar').click()
  });

  it('Agenda remove in table', () => {
    cy.get('[id=removeAction3]').click()
    cy.contains('Borrar').click()
  });

  it('Agenda remove in edit', () => {
    cy.get('[id=editAction3]').click()
    cy.get('[id=removeHeader]').click()
  });
});
