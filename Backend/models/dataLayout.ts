import { DataColumnType } from "./dataColumnType";

export class DataLayout {
    columns: DataColumnType[];

    constructor(columns: DataColumnType[]) {
        this.columns = columns;
    }
}
