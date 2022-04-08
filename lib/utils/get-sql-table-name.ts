export function getSQLTableName(typeName: string) {
    return typeName.charAt(0).toLowerCase() + typeName.slice(1)
        .replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "_" : "") + $.toLowerCase())
};