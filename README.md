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