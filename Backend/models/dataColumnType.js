export class DataColumnType {
    required;
    readonly;
    key;
    title;
    type;
    enumForSelect;
    rolesAllowed;
    arrayTableLayout;

    /**
     * Create a table column
     * @param key the key for the column
     * @param title the title for the column
     * @param required
     * @param readonly whether the column is editable
     * @param type the type of the column
     * @param enumForSelect if the type is select, this is the enum to select from
     * @param rolesAllowed the roles allowed to see this column
     * @param arrayTableLayout the layout for the table displaying the array
     * @param link the link for the column if it is a link
     */
    constructor(key, title, required, readonly,  type = 0, enumForSelect = null, rolesAllowed = null, arrayTableLayout = null, link = null) {
        this.key = key;
        this.title = title;
        this.required = required;
        this.readonly = readonly;
        this.type = type;
        if (type === DataColumnEnum.select && enumForSelect === null) {
            throw new Error("enumForSelect must be set for select columns");
        }
        this.enumForSelect = enumForSelect;
        this.rolesAllowed = rolesAllowed;
        if(type === DataColumnEnum.array && arrayTableLayout === null){
            throw new Error("arrayTableLayout must be set for array columns");
        }
        this.arrayTableLayout = arrayTableLayout;
        if(type === DataColumnEnum.link && link === null){
            throw new Error("link must be set for link columns");
        }
    }
}

export const DataColumnEnum = {
    value: 0,
    array: 1,
    select: 2,
    dateTime: 3,
    boolean: 4,
    textArea: 5,
    link: 6,
}