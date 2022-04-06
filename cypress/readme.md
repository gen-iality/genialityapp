# Pruebas con Cypresss

Para correr los test se debe ejuctar el proyecto ademas del se debe ejuctar el sieguiente comando

`npm run cypress:open`

Esto va abrir una ventana emergente con los diferentes test.

## Ejecución de pruebas

Para ejecutar las pruebas se debe selecionar la carpeta de la segmento a probar, luego presionar sobre la prueba. La cual va abrir un navegador y de manera automatica va emepezar a ejecutar las pruebas.

### Ejecución una prueba en especifico

Para ejecutar una prueba en especifico se debe modificar el documento de la prueba, agrenando despues de it la propietad .only, esto permitira que esa prueba se ejecute, debe tener encuneta que todas las pruebas que tenga esa propiedad en el mismo archivo se va a ejecutar.

`it(.....)` a `it.only(.....)`
