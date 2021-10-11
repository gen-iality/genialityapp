const urlToTest = '/eventadmin/5ea23acbd74d5c4b360ddde2/faqs';

describe('Evius Faqs', () => {
  beforeEach(() => {
    cy.setCookie('evius_token', 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyYWZkYjliOGJmZmMyY2M4ZTU4NGQ2ZWE2ODlmYzEwYTg3MGI2NzgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZXZpdXNhdXRoIiwiYXVkIjoiZXZpdXNhdXRoIiwiYXV0aF90aW1lIjoxNjMxNTM2MTQzLCJ1c2VyX2lkIjoiODFYdERvWExCUFRWdDRTNjNaMjRMMDVScGcwMyIsInN1YiI6IjgxWHREb1hMQlBUVnQ0UzYzWjI0TDA1UnBnMDMiLCJpYXQiOjE2MzE1MzYxNDMsImV4cCI6MTYzMTUzOTc0MywiZW1haWwiOiJhbGVqYW5kcmEucGVyZG9tb0Btb2Npb25zb2Z0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhbGVqYW5kcmEucGVyZG9tb0Btb2Npb25zb2Z0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.kiEu3rTdKRqnbmmgc8Xt8uPTGyAOUOGt06myJrHD3jicyRwhXVglWxoOLlqbWYizVVesV1YIVV6xFEyiH_JUZbB8JBB8lkCYVtfD1H-ubmQPy9dBzF699lcZ-HCrL_D-xQRwxaKRozzYpMIlhuChl_k6bcnzAFkmY8loBP6kNj9PT5tB9dYXCbNHrS6K0M7e2hcVlcSVSEmP6_0350ntZyJiKV9wnoadx1XWAfeKtCnI902JcIdquaZz5-r-FPkkhMOstX68F8Kx-9UvCdzZKydN1nFHwXeKJ1c6ZIMxJmpV9VIbYd3ou_iu92Uzj943QGG-uS0mcIMzdc9D5VX6UQ')
    cy.visit(`${urlToTest}`);
  });

  it('Faqs Create', () => {
    cy.contains('Agregar').click()
    cy.get('[name=title]').type('¿Se puede ingresar a la parte de CMS?', {force: true}) 
    cy.get('[id=faqContent]').then(() => {
      cy.get('.ql-editor').type('Si se puede acceder')
    })
    cy.contains('Guardar').click()
  }); 

  it('Faqs Edit', () => {
    cy.wait(250)
    cy.get('[id=editAction3]').click()
    cy.get('[name=title]').clear()
    cy.get('[id=faqContent]').then(() => {
      cy.get('.ql-editor').clear()
    })
    cy.get('[name=title]').type('¿Se puede ingresar a la parte de CMS 2?', {force: true})  
    cy.get('[id=faqContent]').then(() => {
      cy.get('.ql-editor').type('Si se puede acceder 2')
    })
    cy.contains('Guardar').click()
  });

  it('Faqs Search Title', () => {
    cy.get('[id=searchIcontitle]').click()
    cy.get('[id=searchtitle]').type('ERP')
    cy.contains('Buscar').click()
    cy.get('[id=searchIcontitle]').click()
    cy.contains('Borrar').click({force: true})
  })

  it('Faqs Search Content', () => {
    cy.get('[id=searchIconcontent]').click()
    cy.get('[id=searchcontent]').type('programa')
    cy.contains('Buscar').click()
    cy.get('[id=searchIconcontent]').click().then(() =>
      cy.contains('Borrar').click({force: true})
    )
  })

  it('Faqs cancel remove in table', () => {
    cy.get('[id=removeAction3]').click()
    cy.contains('Cancelar').click()
  });
  
  it('Faqs cancel remove in edit', () => {
    cy.get('[id=editAction3]').click()
    cy.get('[id=removeHeader]').click()
    cy.contains('Cancelar').click()
  });

  it('Faqs remove in table', () => {
    cy.get('[id=removeAction3]').click()
    cy.contains('Borrar').click()
  });

  it('Faqs remove in edit', () => {
    cy.wait(4000)
    cy.get('[id=editAction3]').click()
    cy.get('[id=removeHeader]').click()
    cy.contains('Borrar').click()
  });

});
