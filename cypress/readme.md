# Pruebas con Cypresss

Para correr los test se debe ejuctar el proyecto ademas del se debe ejuctar el sieguiente comando

`npm run cypress:open`

Esto va abrir una ventana emergente con los diferentes test.

## Ejecución de pruebas

Para ejecutar las pruebas se debe selecionar la carpeta de la segmento a probar, luego presionar sobre la prueba. La cual va abrir un navegador y de manera automatica va emepezar a ejecutar las pruebas.

### Ejecución una prueba en especifico

Para ejecutar una prueba en especifico se debe modificar el documento de la prueba, agrenando despues de it la propietad .only, esto permitira que esa prueba se ejecute, debe tener encuneta que todas las pruebas que tenga esa propiedad en el mismo archivo se va a ejecutar.

`it(.....)` a `it.only(.....)`

## Pruebas de Autenticación

Las pruebas se dividen en:

### LoginEvent

Esta contiene las pruebas del inicio de sesión.

- **_Prueba cambio de formulario a Login:_** En esta prueba hace prueba de que el botón de iniciar sesión en modal para que se visualice el formulario funciona.
- **_Prueba de validación de campos vacíos:_** En esta prueba se evalúa de que se visualice al usuario que debe ingresar las credenciales para poder ingresar.
- **_Prueba de validación de correo y campo de contraseña vacía:_** En esta prueba se evalúa que no se pueda iniciar sesión debido a que el correo no cumple con formato email y la contraseña esta vacía.
- **_Prueba de validación de contraseña:_** En este se evalúa que no se pueda ingresar debido a que el campo de contraseña esta vacía, el cual debe visualizar que se debe ingresar la contraseña.
- **_Prueba de validación de correo:_** En esta prueba evalúa si el correo no existe en la base de datos, el cual visualiza la alerta de que este email no está registrado.
- **_Prueba de validación de contraseña incorrecta:_** En esta prueba evalúa que se visualice la alerta al colocar una contraseña incorrecta.
- **_Prueba de login:_** En esta prueba se evalúa que se puede iniciar sesión
  si todos los campos estén correctos, además de iniciar sesión evalúa
  que se pueda salir de la sesión iniciada **(Esta prueba puede fallar
  por la condicional del usuario no registrado en el curso)**

### LoginWithEmailEvent

Esta contiene las pruebas de inicio de sesión con correo.

- **_Prueba de validación de botón iniciar sesión solo con mi correo:_** En esta prueba evalúa que exista el botón de iniciar sesión solo con mi correo cuando se cambia al formulario de inicio de sesión.
- **_Prueba de visualización modal de iniciar sesión con correo:_** En esta prueba evalúa que se muestre el modal de iniciar sesión con correo al momento de presionar sobre el botón de iniciar sesión solo con mi correo.
- **_Prueba de validación de correo:_** En esta prueba se evalúa que aparezca el mensaje de Ingrese un correo válido, cuando se ingresa la información incorrecta referente al formato email.
- **_Prueba de correo no registrado:_** En esta prueba se evalúa que aparezca el mensaje de no se encuentra el correo registrado cuando se ingresa un usuario no registrado.
- **_Prueba de correo enviado:_** En esta prueba se evalúa que aparezca el mensaje cuando se envía el correo de inicio de sesión con correo cuando se envía.
- **_Prueba inicio de sesión con correo:_** En esta prueba se evalúa que se pueda ingresar al enlace de inicio de sesión con correo, además, de que se pueda salir de la sesión. **(Esta prueba puede fallar por la condicional del usuario se encuentre logueado en otra sesión )**

### RecoverPasswordEvent

Esta contiene las pruebas de restablecimiento de contraseña.

- **_Prueba de visualización modal de recupera contraseña:_** En esta prueba evalúa que se muestre el modal de recupera contraseña al momento de presionar olvidar contraseña.
- **_Prueba de campo correo vacío:_** En esta prueba se evalúa que se visualice el mensaje de El correo es requerido al momento de presionar sobre el botón de Restablecer contraseña cuando el campo este vacío.
- **_Prueba de validación de correo:_** En esta prueba se evalúa que aparezca el mensaje de Ingrese un correo válido, cuando se ingresa la información incorrecta referente al formato email.
- **_Prueba de correo no registrado:_** En esta prueba se evalúa que aparezca el mensaje de no se encuentra registrado cuando se ingresa un usuario no registrado.
- **_Prueba de correo enviado:_** En esta prueba se evalúa que aparezca el mensaje cuando se envía el correo de restablecimiento fue enviado.
- **_Prueba de cambio de contraseña:_** En esta prueba se evalúa que se pueda ingresar al link de restablecimiento de contraseña, además, de que se pueda cambiar la contraseña, que se pueda ingresar con la nueva contraseña y que se pueda cerrar sesión.

### RegisterEvent

Esta contiene las pruebas de inicio de sesión con correo.

- **_Prueba de visualización modal de registro de usuario:_** En esta prueba evalúa que se muestre el modal de registro de usuario, además que los campos nombre, correo electrónico, contraseña existen y que el botón de registro este deshabilitado.
- **_Prueba de validación de campos:_** En esta prueba se evalúa que el botón de registrarse este deshabilitado por que los campos se encuentran vacíos.
- **_Prueba de validación de correo:_** En esta prueba se evalúa que aparezca el mensaje de Ingrese un correo válido, cuando se ingresa la información incorrecta referente al formato email además que los demás campos se encuentre vacíos y que el botón se encuentre deshabilitado.
- **_Prueba de validación de campos Nombre y Contraseña:_** En esta prueba se evalúa que el campo email este correcto, además de que los campos Nombre y Contraseña se encuentre vacíos y que el botón se encuentre deshabilitado.
- **_Prueba de validación de nombre:_** En esta prueba se evalúa que el botón se encuentre deshabilitado por que el campo nombre se encuentra vació. y que los campos correo y contraseña cumplen con los requisitos.
- **_Prueba de validación de contraseña:_** En esta prueba se evalúa aparezca el mensaje de La contraseña debe tener entre 6 a 18 caracteres, al momento de ingresar la contraseña corta o que supere la cantidad de caracteres.
- **_Prueba de correo en uso:_** En esta prueba se evalúa que aparezca el mensaje de alerta por que el correo esta en uso, además de el botón este habilitado cuando se ingresan todos los parámetros.
- **_Prueba de corrección de correo:_** En esta prueba se evalúa que se pueda corregir el correo después de ingresar un correo en uso, además de que el botón de registro se encuentre este habilitado.
- **Prueba de registro de usuario:** Esta prueba evalúa que se pueda registrar el usuario, ingresando todos los campos, imagen, nombre, correo y contraseña, además evalúa que se muestre el modal con los datos del usuario, además que el registro sea éxitos para luego cerrar sesión del nuevo usuario.
- **_Prueba de inicio de sesión:_** En esta prueba se evalúa que se pueda iniciar sesión con el nuevo usuario registrado, adema se salir de la sesión.

### GeneralEventFlow

Esta contiene las generales del flujo.

- **Prueba de registro de usuario:** Esta prueba evalúa que se pueda registrar el usuario, ingresando todos los campos, imagen, nombre, correo y contraseña, además evalúa que se muestre el modal con los datos del usuario, además que el registro sea éxitos para luego cerrar sesión del nuevo usuario.
- **_Prueba de inicio de sesión:_** En esta prueba se evalúa que se pueda iniciar sesión con el nuevo usuario registrado, adema se salir de la sesión.
- **_Prueba de correo enviado de restablecimiento:_** En esta prueba se evalúa que aparezca el mensaje cuando se envía el correo de restablecimiento fue enviado.
- **_Prueba de cambio de contraseña:_** En esta prueba se evalúa que se pueda ingresar al link de restablecimiento de contraseña, además, de que se pueda cambiar la contraseña, que se pueda ingresar con la nueva contraseña y que se pueda cerrar sesión.
- **_Prueba de correo enviado de inicio de sesión:_** En esta prueba se evalúa que aparezca el mensaje cuando se envía el correo de inicio de sesión con correo cuando se envía **(Esta prueba puede fallar por la condicional del usuario se encuentre logueado en otra sesión )**
- **_Prueba inicio de sesión con correo:_** En esta prueba se evalúa que se pueda ingresar al enlace de inicio de sesión con correo, además, de que se pueda salir de la sesión.
- **_Prueba de inicio de sesión:_** En esta prueba se evalúa que se pueda iniciar sesión con el nuevo usuario registrado, adema se salir de la sesión.
