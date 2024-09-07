import { InferAttributes, InferCreationAttributes, Model } from "sequelize";

export class Page extends Model<
    InferAttributes<Page>,
    InferCreationAttributes<Page>
> {
    declare id: number;
    declare pageUrl: string;
    declare pageName: string;
    declare title: string;
    declare body: string;
    declare stylesheets: string[];
    declare scripts: string[];
}