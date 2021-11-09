import { Injectable } from '@nestjs/common';

// Librerias de TypeOrm
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateResult, DeleteResult } from 'typeorm';
import { Like } from "typeorm";
import { Not } from "typeorm";

// Otras librerias. 
import * as bcrypt from 'bcrypt';
import { DummyPromise } from '../../assets/promises.assets';
import { UserEntity } from 'src/models/user.entity';
import { ROUNDS_BCRYPT } from 'src/config/bcrypt.config';
import { URL_Server } from 'src/config/server.config';

@Injectable()
export class UsersService {

    // 1 agregamos la InjectRepository y instanciamos el Repositorio 
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) { }

    async Get(id: number): Promise<UserEntity> {

        // Hacemos una busqueda por id
        return await this.userRepository.findOne({
            where: {
                id: id,
                status: Not(false)
            }
        }).then(
            resultFind => {
                // Validamos si encontro al usuario.
                if (!resultFind) throw new Error('user_does_not_exist');
                // Vaciamos el campo del password.
                resultFind.password = null;
                // retornamos el objeto.
                return resultFind;
            });

    }

    async Gets(user: UserEntity): Promise<UserEntity[]> {

        // Hacemos where por todos los campos de la entidad
        return await this.userRepository.find({
            where: [
                // name && surname && nick && email
                {
                    id: (user.id || Like('%' + '%')),
                    nick: Like('%' + (user.nick || '') + '%'),
                    name: Like('%' + (user.name || '') + '%'),
                    lastName: Like('%' + (user.lastName || '') + '%'),
                    phoneNumber: Like('%' + (user.phoneNumber || '') + '%'),
                    role: Like('%' + (user.role || '') + '%'),
                    status: Not(false)
                }
            ]
        }).then(
            (result: UserEntity[]) => {

                // Recorremos y borramos el password.
                result.forEach(user => {
                    // delete user.password;
                    user.password = '';
                });

                // No lo validamos por que puede llegar vacio.
                return result;
            }
        )
    }

    async CreateUserNickUnique(user: UserEntity): Promise<UserEntity> {

        // buscamos si el nick o email ya esta en uso.
        return await this.userRepository.findOne({
            where: [
                // hacemos un where donde buscamos por nick o email.
                {
                    nick: user.nick
                }
            ]
        }).then((result) => {
            // validamos si exite un resultado.
            if (result) {
                // Si existe, generamos un error para no continual.
                throw 'REPEAT_NICK';
            }

            // encriptamos el password.
            return bcrypt.hash(user.password, ROUNDS_BCRYPT);

        }).then(password => {
            // le asignamos el password encriptado al objeto
            user.password = password;

            // Eliminamos el user id
            delete user.id;

            // procedemos hacer el save.
            return this.userRepository.save(user);

        }).then(
            (resultSave: UserEntity) => {
                // Validamos si encontro al usuario.
                if (!resultSave) throw new Error('ERROR_USER_SERVICE_CREATE_USER_SAVE_USER');

                // Borramos el password.
                resultSave.password = '';

                return resultSave;
            }
        );
    }

    // Actualiza un usuario
    async UpdateUserNickUnique(user: UserEntity): Promise<UserEntity> {
        // Contrasela antigua
        let contraseniaOld = '';

        // Hacemos una busqueda por id
        return await this.userRepository.findOne({
            where: [
                // hacemos un where donde buscamos por id.
                { id: user.id }
            ]
        }).then(resultFind => {

            // Validamos si encontro al usuario.
            if (!resultFind) throw new Error('user_does_not_exist');

            // Guardamos el password actual.
            contraseniaOld = resultFind.password;

            // verificamos que el email no este en uso, recordemos que el email es unico.
            return this.userRepository.findOne({
                where: [
                    // hacemos un where donde buscamos por email y no sea del mismo id.
                    {
                        id: Not(resultFind.id),
                        nick: user.nick
                    }
                ]
            });
        }).then(result => {
            // validamos si exite un resultado.
            if (result) {
                // Si existe, generamos un error para no continual.
                throw 'REPEAT_NICK';
            }

            // Si existe el password lo encriptamos.
            if (user.password) {
                // encriptamos el password.
                return bcrypt.hash(user.password, ROUNDS_BCRYPT);
            } else {
                // retornamos la antigua contraseña.
                return contraseniaOld;
            }

        }).then(
            (password: string) => {
                // Validamos el resultado.
                if (!password) throw new Error('Revisar User.service la funcion hash o el retun no, respondio como se esperaba.');

                // asignamos el password encriptado al objeto
                user.password = password;

                // Actualizamos
                return this.userRepository.update(user.id, user);
            }
        ).then(resultUpdate => {

            if (!resultUpdate) throw new Error('userRepository.update no respondio como esperabamos.');

            // borramos el password por seguridad.
            // delete user.password;
            user.password = '';

            // Envio respuesta con el resultado recibido del ultimo paso
            return user;
        });
    }

    // Elimina a un usuario por id
    async Delete(userId: number): Promise<UserEntity> {

        let user: UserEntity = new UserEntity();

        // Eliminamos de la base de dato al usuario.
        return await this.userRepository.findOne({
            where: [
                // hacemos un where donde buscamos por id.
                { id: userId }
            ]
        }).then(resultFind => {
            // Validamos si encontro al usuario.
            if (!resultFind) throw new Error('user_does_not_exist');

            // Seteamos al usuario.
            user = resultFind;
            // Desactivamos el estado.
            user.status = false;

            // Actualizamos al usuario
            return this.userRepository.update(user.id, user);
        }).then(
            resultSave => {

                // Validamos si se actualizo correctamente.
                if (!resultSave) throw new Error('error_user_save');
                // Borramos el password.
                user.password = '';

                return user;
            }
        )
    }

    async GetUserByNick(nick: string): Promise<UserEntity> {

        return await DummyPromise().then(
            result => {
                //
                return this.userRepository.findOne({
                    where: [
                        // hacemos un where donde buscamos por email.
                        { nick: nick }
                    ]
                });
            }
        ).then((resultUser: UserEntity) => {

            if (!resultUser) throw new Error('user_was_not_found');

            return resultUser;
        });
    }

    
    // Actualiza el filename del usuario ademas retorna el newfilename.
    async UpdateImageUser(id: number, newFilename: string): Promise<string> {


        let urlImage: string = URL_Server.back + '/' + newFilename;
        // Hacemos una busqueda por id
        return await this.userRepository.update(id, { filename: urlImage }).then(resultUpdate => {

            if (!resultUpdate) throw new Error('userRepository.update no respondio como esperabamos.');

            // Envio respuesta con el resultado recibido del ultimo paso
            return urlImage;
        });
    }

}
