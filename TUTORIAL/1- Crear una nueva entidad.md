# Manual para crear una nueva entidad en la BD.



### Generamos el modulo
nest g module components/products

### Generamos los servicios
nest g service components/products

### Generamos el controlador
nest g controller components/products

### Generamos la Entidad
nest g class models/product.entity



#### Agregar los atributos al modelo de la entidad.
Agregamos los atributos a la entidad que se encuentra en el directorio models.

#### Modificamos las dependencias TypeORM dentro del modulo. 
Esto se encuentra en el components/users/users.module.ts

#### Modificamos el servicio del modulo.
Modificamos el servicio del modulo, aqui es donde haremos el crud


#### Modificamos el controllador.
Aqui estaremos creando los servicios que seran consumidos por el front.