# Manual para crear una nueva entidad en la BD.



### Generamos el modulo
nest g module components/users

### Generamos los servicios
nest g service components/users

### Generamos el controlador
nest g controller components/users

### Generamos la Entidad
nest g class models/user.entity




#### Agregar los atributos al modelo de entidad.
Agregamos los atributos a la entidad que se encuentra en el directorio models.

2) Modificamos las dependencias TypeORM al modulo.
3) Modificamos el servicio del modulo.
4) Modificamos el controllador.