import {
    Association,
    CreationOptional, HasOneGetAssociationMixin,
    InferAttributes,
    InferCreationAttributes,
    Model
} from "sequelize";
import { Repository } from "./repository";

export class SaveFile extends Model<
  InferAttributes<SaveFile>,
  InferCreationAttributes<SaveFile>
> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare path: string;
    declare content: string;
    declare repositoryId: number;

    declare getRepository: HasOneGetAssociationMixin<Repository>;

    declare static associations: {
    repository: Association<SaveFile, Repository>;
  };
}
