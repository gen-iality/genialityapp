const urlToTest = '/eventadmin/5ea23acbd74d5c4b360ddde2/trivia';

describe('Evius Trivia', () => {
  beforeEach(() => {
    cy.setCookie('evius_token', 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyYWZkYjliOGJmZmMyY2M4ZTU4NGQ2ZWE2ODlmYzEwYTg3MGI2NzgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZXZpdXNhdXRoIiwiYXVkIjoiZXZpdXNhdXRoIiwiYXV0aF90aW1lIjoxNjMxNTM2MTQzLCJ1c2VyX2lkIjoiODFYdERvWExCUFRWdDRTNjNaMjRMMDVScGcwMyIsInN1YiI6IjgxWHREb1hMQlBUVnQ0UzYzWjI0TDA1UnBnMDMiLCJpYXQiOjE2MzE1MzYxNDMsImV4cCI6MTYzMTUzOTc0MywiZW1haWwiOiJhbGVqYW5kcmEucGVyZG9tb0Btb2Npb25zb2Z0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhbGVqYW5kcmEucGVyZG9tb0Btb2Npb25zb2Z0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.kiEu3rTdKRqnbmmgc8Xt8uPTGyAOUOGt06myJrHD3jicyRwhXVglWxoOLlqbWYizVVesV1YIVV6xFEyiH_JUZbB8JBB8lkCYVtfD1H-ubmQPy9dBzF699lcZ-HCrL_D-xQRwxaKRozzYpMIlhuChl_k6bcnzAFkmY8loBP6kNj9PT5tB9dYXCbNHrS6K0M7e2hcVlcSVSEmP6_0350ntZyJiKV9wnoadx1XWAfeKtCnI902JcIdquaZz5-r-FPkkhMOstX68F8Kx-9UvCdzZKydN1nFHwXeKJ1c6ZIMxJmpV9VIbYd3ou_iu92Uzj943QGG-uS0mcIMzdc9D5VX6UQ')
    cy.visit(`${urlToTest}`);
  });

  it('Trivia Create', () => {
    cy.contains('Agregar').click()
    cy.get('[name=survey]').type('Encuesta Prueba 1') 
    cy.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false
    })
    cy.contains('Guardar').click()
    cy.wait(200)
    cy.contains('Guardar').click()
  });
  
  it('Trivia Edit', () => {
    cy.get('[id=editAction6]').click()
    cy.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false
    })
    cy.wait(1200)

    cy.get('[name=time]').type(500)
    cy.get('[name=allow_anonymous_answers]').click()
    cy.get('[name=publish]').click()
    cy.get('[name=displayGraphsInSurveys]').click()
    cy.get('[name=openSurvey]').click()
    cy.get('[name=showNoVotos]').click()
    cy.get('[name=isGlobal]').click()
    
    cy.get('[name=allow_gradable_survey]').click().then((value) => {
      if(value.button) {
        console.log(value);
        //If allow_gradable_survey react-quill
      cy.get('[id=initialMessage]').clear()
      cy.get('[id=initialMessage]').type('Mensaje Inicial')
      cy.get('[id=win_Message]').clear()
      cy.get('[id=win_Message]').type('Mensaje Ganador')
      cy.get('[id=neutral_Message]').clear()
      cy.get('[id=neutral_Message]').type('Mensaje Neutral')
      cy.get('[id=lose_Message]').clear()
      cy.get('[id=lose_Message]').type('Mensaje Perdedor')
      }
    })
    cy.get('[name=ranking]').click()
    //If hasMinimumScore
    //cy.get('[name=minimumScore]').type('40')

    cy.contains('Guardar').click()

  });

  it('Trivia cancel remove in table', () => {
    cy.get('[id=removeAction6]').click()
    cy.contains('Cancelar').click()
  });
  
  it('Trivia cancel remove in edit', () => {
    cy.get('[id=editAction6]').click()
    cy.wait(1000)
    cy.get('[id=removeHeader]').click()
    cy.contains('Cancelar').click()
  });

  it('Trivia remove in table', () => {
    cy.get('[id=removeAction6]').click()
    cy.contains('Borrar').click()
  });
});
