export const findTable = (tables: any, name: string) => {
    for (let table in tables) {
        if (tables[table].name == name) {
            return tables[table];
        }
    }
    return undefined;
};