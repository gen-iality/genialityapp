ad# Importación de módulos

Ahora existe una nueva forma de importar los componentes o elementos de la aplicación, para hacer uso de este debe colocar **“~/”** luego el componente.

**Forma común:**
`import { DocumentsApi } from '../../../helpers/request';`

**Nueva forma:**
`import { DocumentsApi } from '@helpers/request';` || `import { DocumentsApi } from '@/helpers/request';`

## Importaciones agregadas

- @/
- @components
- @adaptors
- @antdComponent
- @App
- @containers
- @contexts
- @exhibitors
- @helpers
- @PreloaderApp
- @redux
- @styles
- @Utilities
- @Assets

## Tener en cuenta

No se puede realizar el siguiente importacion:

`import { CurrentEventUserContext } from './eventUserContext';`
**a**
`import { CurrentEventUserContext } from '@/eventUserContext';`

Solo se pueden hacer importaciones desde las carpeta que se encuentra en la raiz.

## Configuracióne general

### tsconfig.json

`"compilerOptions":{"baseUrl": "src","paths":{"@/*": ["./*"]},"allowJs": true}, "include": "src"`

Lo que realiza es que se define la ruta principal y de acuerdo con esta, en paths se define la rutas que se van a cambiar, en esta caso se define el import absolute.

### vite.config.ts

`resolve:{alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],}`

Lo que realiza es que todo lo que tenga @ lo remplaza por la ruta principal

## Agregar un nuevo alias

Para agregar un nuevo alias se debe modificar el archivo tsconfig.json y vite.config.ts.

### Configuracion en tsconfig.json

Se debe agregar en paths el alias que va recibir y la ruta que va remplazar como se ilustra a continuacion:

`"paths":{..., "@contextTypeActivity/*":["./context/typeactivity/*"]}`

De esa forma se agrega la nuevo alias para esa ruta, ahora se debe configurar el alias en vite para que esta pueda ser reconocido al momento de compilar.

### Configuracion en vite.config.ts

Se debe agragar el alias del path nuevo que va recibir y la ruta que se va remplazar como se ilustra a continuacion:

`alias:[..., {find: "@contextTypeActivity", replacement: path.resolve(__dirname, 'src/context/typeactivity') }]`

Se deben guardar los cambios y validar el funcionamiento.
