## Registro de usuarios

La aplicación permite registrar nuevos usuarios mediante el endpoint:

POST /auth/registrar

El formulario solicita:

- username
- password
- rol

Después de un registro exitoso, el servidor responde con HTTP 201 Created y la aplicación redirige automáticamente al Login después de 2 segundos.

## Flujo de autenticación

1. Registro del usuario.
2. Contraseña cifrada con BCrypt en el backend.
3. Inicio de sesión.
4. Generación del JWT.
5. Almacenamiento del token en localStorage.
6. Acceso a rutas protegidas.
7. Logout e invalidación del token.

## CRUD de Vehículos con imágenes BLOB

La aplicación permite gestionar vehículos protegidos mediante autenticación JWT.

### Operaciones

- Crear vehículos con imagen.
- Consultar vehículos registrados.
- Descargar las imágenes mediante un endpoint protegido.
- Editar marca y modelo.
- Reemplazar opcionalmente la imagen.
- Eliminar vehículos.

### Backend

Spring Boot, Spring Security, JWT, JPA/Hibernate y PostgreSQL.

### Frontend

React, React Router, Fetch API, FormData, Blob y Object URL.

### Endpoints

POST /auth/vehiculos/registrar

GET /auth/vehiculos

GET /auth/vehiculos/{id}/foto

PUT /auth/vehiculos/{id}

DELETE /auth/vehiculos/{id}