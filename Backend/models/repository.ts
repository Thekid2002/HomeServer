import {
    Association,
    CreationOptional, HasManyGetAssociationsMixin, HasOneGetAssociationMixin,
    InferAttributes,
    InferCreationAttributes,
    Model
} from "sequelize";
import { User } from "./user";
import { SaveFile } from "./saveFile";

export class Repository extends Model<
  InferAttributes<Repository>,
  InferCreationAttributes<Repository>
> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare description: string;
    declare userId: number;
    declare entryPointFileId: number | null;
    declare runtimeFileId: number | null;
    declare runtimeImportFileId: number | null;

    declare getUser: HasOneGetAssociationMixin<User>;
    declare getSaveFiles: HasManyGetAssociationsMixin<SaveFile>;


    declare static associations: {
    saveFiles: Association<Repository, SaveFile>;
    user: Association<Repository, User>;
  };
}
