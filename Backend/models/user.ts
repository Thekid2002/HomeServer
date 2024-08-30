
import { Repository } from "./repository";
import { getAllRepositoriesByUserId } from "../repositories/repositoryRepository";
import {
    Association,
    CreationOptional,
    HasManyGetAssociationsMixin,
    InferAttributes,
    InferCreationAttributes,
    Model
} from "sequelize";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
    declare id: CreationOptional<number>;
    declare firstname: string;
    declare surname: string;
    declare phone: string;
    declare email: string;
    declare salt: string;
    declare password: string;
    declare role: number;
    declare token: string | null;
    declare signupDateTime: number;
    declare expirationDateTime: number | null;

    declare getRepositories: HasManyGetAssociationsMixin<Repository>;

    declare static associations: {
        repositories: Association<User, Repository>;
    };
}
