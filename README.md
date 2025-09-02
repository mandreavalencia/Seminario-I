# Seminario-I

Luis Alejandro Solis
Michell Andrea Valencia
Ana Lorena Vente

React - README

Origen

React fue creado en 2011 por Jordan Walke, ingeniero de software en Facebook, con el objetivo de mejorar la eficiencia y escalabilidad de las interfaces de usuario en aplicaciones con gran cantidad de actualizaciones, como el News Feed de Facebook. Posteriormente se implementó en Instagram en 2012, demostrando su capacidad para manejar interfaces complejas. Finalmente, en 2013, React fue presentado oficialmente al público durante la conferencia JSConf US y liberado como un proyecto de código abierto, lo que impulsó su rápida adopción y crecimiento dentro de la comunidad de desarrolladores.

Características

Declarativo: facilita describir cómo debe verse la interfaz y React se encarga de actualizarla según los cambios.

Basado en componentes: permite dividir la UI en piezas reutilizables, lo que hace el código más ordenado y modular.

Virtual DOM: optimiza el rendimiento al actualizar solo los elementos necesarios en lugar de recargar todo el DOM real.

Unidireccionalidad de datos: el flujo de datos va de padres a hijos, lo que simplifica la gestión de estados.

Gran ecosistema y comunidad: ofrece múltiples librerías complementarias y cuenta con una amplia base de desarrolladores.


Ventajas

- Alto rendimiento gracias al Virtual DOM que optimiza las actualizaciones.

- Reutilización de componentes, lo que ahorra tiempo y facilita el mantenimiento.

- Gran comunidad y ecosistema con muchos recursos, librerías y soporte.

- Fácil integración con otras tecnologías y frameworks.

- Escalabilidad permite construir desde proyectos pequeños hasta aplicaciones grandes y complejas.

- React Native extiende su uso al desarrollo móvil multiplataforma.

Desventajas

- No es un framework completo, requiere librerías adicionales (como React Router o Redux) para ciertas funcionalidades.

- Curva de aprendizaje al manejar conceptos como hooks, estados globales o el manejo del ciclo de vida de los componentes.

- JSX puede resultar confuso al inicio para quienes vienen de HTML/CSS tradicional.

- Cambios frecuentes la evolución rápida obliga a estar en constante actualización.

- Rendimiento en aplicaciones muy grandes puede depender mucho de una buena arquitectura del proyecto.


Casos de uso

- Redes sociales: Facebook e Instagram lo usan para manejar interfaces dinámicas y con alto tráfico.

- Plataformas de streaming: Netflix utiliza React para mejorar la experiencia de usuario y la velocidad de carga.

- Aplicaciones de viajes y hospedaje: Airbnb emplea React para ofrecer interfaces interactivas y rápidas.

- Aplicaciones de mensajería: WhatsApp Web está construido en gran parte con React.

- Servicios de almacenamiento y productividad: Dropbox y Trello lo usan para crear interfaces intuitivas.

- Delivery y movilidad: Uber Eats implementa React en su aplicación web.


Tecnologías relacionadas

- Node.js: Permite ejecutar JavaScript fuera del navegador. Es necesario para correr herramientas de desarrollo como create-react-app o Vite.

- npm / Yarn: Son gestores de paquetes que se usan para instalar dependencias, librerías y scripts en proyectos React.

- React Router: Librería para manejar la navegación y rutas dentro de aplicaciones de una sola página (Single Page Applications).


Cuadro comparativo


Instalación de React con Vite

Este proyecto se creó usando *Vite* como herramienta de construcción, ya que es más rápida y ligera que Create React App (CRA).

 Pasos de instalación

- Crear el proyecto con Vite
npm create vite@latest react-app

-Entrar a la carpeta del proyecto
cd react-app

-Instalar dependencias
npm install

-Iniciar el servidor de desarrollo
npm run dev


 Comparativo: Vite CLI vs Create React App (CRA)

|  Característica       |    Vite CLI              |    Create React App (CRA)     |
| --------------------- | ----------------------   | ---------------------------   |
| *Velocidad de inicio* | Muy rápida (ms)          | Lenta (segundos-minutos)      |
| *Build final*         | Optimizada y ligera      | Más pesada                    |
| *Configuración*       | Flexible y visible       | Oculta y difícil de modificar |
| *Soporte moderno*     | ESModules, TS, JSX, etc. | Compatible pero más lento     |
| *Popularidad actual*  | En crecimiento           | En desuso                     |

Conclusión

React se ha consolidado como una de las herramientas más importantes en el desarrollo frontend moderno gracias a su enfoque declarativo, su arquitectura basada en componentes y el uso del Virtual DOM, que permiten construir interfaces rápidas, modulares y escalables. Aunque no es un framework completo y depende de librerías externas para ciertas funciones, su gran comunidad, ecosistema en constante crecimiento y adopción por parte de grandes empresas lo convierten en una opción sólida y confiable para proyectos de todo tipo, desde aplicaciones pequeñas hasta plataformas de gran escala.
