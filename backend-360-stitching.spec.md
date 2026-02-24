# OpenSpec: Backend 360 Capture & Stitching (Phase 2)

## 1. OBJETIVO PRINCIPAL

Desarrollar un sistema backend robusto, concurrente y escalable capaz de recibir múltiples fotografías tomadas desde una app móvil, y procesarlas (Stitching) para generar una imagen panorámica esférica (Equirectangular) de 360 grados.
**¿Por qué?:** Para permitir a los usuarios crear tours virtuales inmersivos de alta calidad usando únicamente sus teléfonos móviles, sin depender de costosas cámaras 360 dedicadas.

## 2. ALCANCE

### In-Scope (Dentro del Alcance)

- **API REST en C# (.NET Core)** para recibir cargas masivas de imágenes (Multipart Form Data).
- Gestión de estados de los trabajos (Jobs) de procesamiento (Ej: "Recibido", "Procesando", "Completado", "Error").
- **Worker en Python** que ejecuta algoritmos de _Panorama Stitching_ usando OpenCV.
- Comunicación básica entre el API C# y el Worker Python (mediante ejecución de subprocesos, cola de mensajes simple o HTTP interno).
- Almacenamiento de las imágenes resultantes y provisión de una URL para el visualizador web.

### Out-of-Scope (Fuera del Alcance por ahora)

- La aplicación móvil de captura en React Native (se definirá en otra especificación).
- Autenticación compleja de usuarios o pasarelas de pago.
- Edición manual de las costuras (Seams) por parte del usuario web.

## 3. DECISIONES TÉCNICAS

- **API Server:** Escrito en `C#` con el framework `ASP.NET Core 8+`.
  - _Justificación:_ Excelente rendimiento en operaciones de I/O asíncronas para recibir grandes volúmenes de fotos concurrentemente. Tipado fuerte y robustez empresarial.
- **Stitching Worker:** Escrito en `Python 3.10+`.
  - _Justificación:_ Acceso nativo y documentado a `cv2` (OpenCV) y su clase `Stitcher`. Ecosistema ideal para procesamiento rápido de imágenes e IA.
- **Comunicación API <-> Worker:** Inicialmente, para mantener el MVP simple, la API de C# invocará el script de Python como un subproceso subyacente (`Process.Start`), pasándole las rutas de las imágenes como argumentos. Una evolución futura emplearía RabbitMQ o REDIS.
- **Almacenamiento:** Sistema de archivos local (para desarrollo) estructurando directorios por ID de tarea única (`JobId`).

## 4. MODELOS DE DATOS

### Entidad: `StitchJob`

- `Id` (UUID)
- `Status` (Enum: Pending, Processing, Completed, Failed)
- `CreatedAt` (DateTime)
- `CompletedAt` (DateTime nullable)
- `InputImagePaths` (List<string>)
- `ResultImagePath` (string nullable)
- `ErrorMessage` (string nullable)

## 5. ENDPOINTS BÁSICOS (C# API)

- `POST /api/v1/stitch/upload`: Recibe un payload `multipart/form-data` con un array de imágenes. Retorna el objeto `StitchJob` indicando estado `Pending`.
- `GET /api/v1/stitch/status/{jobId}`: Devuelve el estado actual de un trabajo. El cliente realiza un polling a este endpoint.
- `GET /api/v1/stitch/result/{jobId}`: Sirve la imagen panorámica finalizada si el status es `Completed`.

## 6. PLAN DE PRUEBAS / QUALITY GATES

1.  **Test de Carga API:** Enviar un request con unas 30 imágenes pesadas (50MB+ total) y comprobar que C# acusa recibo inmediatamente y no bloquea el hilo principal.
2.  **Test de Computación (Python):** Alimentar el script Python directamente desde la consola con 10 fotos cruzadas y examinar el output visual. `Stitcher::create` debe devolver `OK`.
3.  **End-to-End:** Enviar fotos vía la API, aguardar el polling (intervalo de 3 segundos), y finalizar descargando el pano cuando devuelva `Completed`. Se añadirá un test automatizado E2E una vez el backend C# base esté configurado, haciendo curl multipart y leyendo el estado hasta "Completed".

## 7. CONSIDERACIONES ADICIONALES

- **Limitación de Archivos:** Kestrel por defecto limita el _MaxRequestBodySize_ a 30MB, debemos incrementar ese límite específicamente para el Endpoint Upload (a 150MB o más) de C#.
- **Timeout:** El cliente que hace la petición (React Native) no puede esperar vivo la respuesta de la costura. Todo es completamente Asíncrono por la naturaleza costosa del _Stitching Algorithm_ de C++.
