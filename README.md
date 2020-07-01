EVIUS

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

[Bulma](https://bulma.io) used as a UI Framework currently being migrated to ant design.

[live webinars zoom websdk](https://bloggeek.me/when-will-zoom-use-webrtc/) useful description of the thechnology

###

### Requirements

- Node >= 6 on your local development machine

### How to...?

- clone repo
- yarn install

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.<br>
API URL: [https://api.evius.co](https://api.evius.co)

The page will reload if you make edits some JS file or SCSS file.<br>
You will also see any lint errors in the console.

#### `npm start:dev`

### Modulos

#### Encuestas

###### Tecnologias

- Chart.js
- Survey.js

###### Descripcion Landing

Las encuestas permiten realizar tipos de votaciones para los usuarios, dichos votaciones posteriormente pueden visualizarse dentro
de graficas en tiempo real utilizando Firebase.

Dentro de las encuestas, existen dos tipos de implementacion:

- Calificables
  - Las calificables permiten tener un puntaje que previamente puede ser asignado a cada pregunta. Por defecto el puntaje sera 1 si no se
    le asigna ningun puntaje.
  - Cuentan con un contador asignado a cada pregunta, definiendo el tiempo de duracion para las mismas.
  - es posible congelar las encuesta, para evitar que cambie de pagina, para esto se maneja una propiedad llamada freezeGame, manejanda
    directamente con Firebase, para obtener cambios en tiempo real.
- Votaciones
  - Pueden manejarse sencillas o con un valor para el voto, que se puede asignar a cada usuario, esto se vera reflejado dentro de los resultados generales.

###### Descripcion Admin

Para administrar las encuestas estas cuentan en particular con 2 secciones, una para visualizar resultados o reportes, y otra para crearlas o editarlas.
Dentro de los reportes se mostrara informacion detallada de la cantidad de votantes por pregunta incluso se podra realizar la exportacion. Por otro lado,
existe la posibilidad de votar por algun usuario inscrito, donde lo unico que se necesitara sera el usuario, la pregunta y la respuesta a registrar

La edicion de las encuestas posee varias alternativas:

- Permitir usuarios anonimos (Habilita la encuesta para usuarios sin cuenta)
- Publicar encuesta (Se mostrar la encuesta en el landing)
- Abrir encuesta (Abrira la encuesta, si no se encuetra abierta se veran los resultados)
- Permitir valor del voto por usuario (Funciona unicamente para votaciones, esto permite que cada voto de algun usuario tenga un valor)
- Encuesta calificable (sera una encuesta con contador y se podra asignar la respuesta correcta)
- Relacionar encuesta a actividad (se podra asignar una encuesta a alguna actividad)

Dentro de la edicion de cada pregunta se podra asignar el tipo de pregunta (seleccion multiple o unica), titulo, y las opciones o respuestas que tendra (maximo 5,
si se desea cambiar ese valor, se podra actualizar dentro del componente de formEdit).
La edicion de cada pregunta dependera de una propiedad en particular.

- Encuesta calificable (la cual se podra asignar un valor a la respuesta correcta de cada pregunta)

#### Networking

El networking tiene 3 pestaña donde se puede visualizar:

- Asistentes al evento
- Contactos del usuario
- Solicitudes (enviadas/recibidas)

Las solicitudes trabajan de la mano para realizar envios de correos, avisando a los usuarios de dicha solicitud, estas pueden ser tanto
rechazadas, como aceptadas.

#### Registro

El registro permite realizar inscripciones a eventos, independiente de si el usuario este o no registrado, dado que en caso de que no tenga cuenta
se le creara en el momento. Se podra mostrar el formulario de registro solo si el usuario no se encuentra inscrito al evento de lo contrario mostrara
una card informativa de los datos ingresados.

##### DEPRECATED

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.<br>
API URL: [https://dev.evius.co](https://dev.evius.co)

The page will reload if you make edits some JS file or SCSS file.<br>
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](#deployment) for more information.

#### `npm run dev`

##### DEPRECATED

Builds the app for production dev branch to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](#deployment) for more information.

### Branch

`master → Development branch`
`prod → Production branch`
