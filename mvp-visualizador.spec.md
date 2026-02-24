# Visor 360 Cubemap - OpenSpec

## 1. Introducción

El MVP (Producto Mínimo Viable) inicial de Inmobiliaria3D se centrará en probar la capacidad técnica más importante: recrear una habitación en 360° en un navegador web, utilizando JavaScript.
Para resolver el reto tecnológico de forma rápida y gratuita (evitando costosos servidores de procesamiento de imagen), utilizaremos la técnica de "Cubemap". El usuario toma 6 fotos desde el centro de la habitación (Frente, Atrás, Izquierda, Derecha, Techo, Suelo) y el visor web las mapea sobre las paredes interiores de un cubo 3D virtual.

## 2. Metas (Goals)

- Construir una interfaz web que renderice una habitación 360° inmersiva.
- Utilizar el enfoque de 6 imágenes (Cubemap) para generar la habitación.
- Implementar al menos un "Hotspot" (punto interactivo simulando una puerta) que permita saltar a otra habitación diferente.

## 3. Quality Gates (BARRERA CRÍTICA)

El agente implementador no puede dar su tarea por terminada hasta que estos comandos pasen sin errores.

- **Comandos de Consola a ejecutar:** `npm run build` y `npm run lint`.
- **Verificación UI:** Abrir el servidor local de desarrollo (`npm run dev`) y verificar visualmente que el cubo 360 responde al arrastre del ratón.

## 4. Historias de Usuario (Requerimientos Funcionales)

### US-001: Visualizador Cúbico 360

**Descripción:** Como interesado en el inmueble, quiero poder arrastrar el ratón sobre una vista web para mirar alrededor de una habitación completa (360 grados).
**Criterios de Aceptación a Validar:**

- [ ] La web muestra un visor 3D en pantalla completa.
- [ ] El visor carga y mapea correctamente un set estático de 6 imágenes de prueba (Techo, Suelo, Frontal, Trasera, Izquierda, Derecha).
- [ ] El usario puede mover la cámara (paneo local).

### US-002: Navegación por Puertas (Hotspots)

**Descripción:** Como usuario, quiero hacer clic en un indicador sobre una puerta para "teletransportarme" a la habitación contigua.
**Criterios de Aceptación a Validar:**

- [ ] Existe un marcador visual 3D (Hotspot) sobreponiéndose a la escena en unas coordenadas específicas.
- [ ] Al hacer clic en el Hotspot, el visor reemplaza instantáneamente las 6 imágenes actuales por el set de imágenes de la nueva habitación.

## 5. Non-Goals (Out of Scope)

- **NO** desarrollar aplicación móvil nativa (React Native) en esta iteración. Solo Web.
- **NO** implementar login, bases de datos o paneles de administración todavía. El visor usará rutas de imágenes estáticas ("mockeadas") para validar la experiencia primero.
- **NO** utilizar algoritmos complejos de _Stitching_ (costura de panorámicas equirectangulares reales). Nos ceñimos estrictamente al modelo de Cubo (6 caras planas).
- **NO** modelar muebles u objetos en 3D volumétrico real. Todo es textura en una imagen plana.

## 6. Consideraciones Técnicas/Arquitectónicas

- **Framework Frontend:** React a través de **Next.js** (App Router).
- **Librería 360:** Se recomienda utilizar `three.js` (a través de `@react-three/fiber` y `@react-three/drei`) o librerías especializadas como `photo-sphere-viewer` que soporten adaptadores Cubemap.
- **Estilos:** Tailwind CSS u hojas de estilo base simples para layout.
