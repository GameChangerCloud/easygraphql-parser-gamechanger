export const findField = (fields: any, columnName: string) => {
    for (let pos in fields) {
        if (fields[pos].field === columnName) {
            return fields[pos];
        }
    }
    return undefined;
};