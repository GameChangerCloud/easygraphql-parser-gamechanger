export const findTable = (tables: any[], name: string) => {
    return tables.find(table => table.name == name)
};