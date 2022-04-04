export function getSQLTableName(typeName: string) {
    return typeName.charAt(0).toLowerCase() + typeName.slice(1)
        .replace(/([A-Z])/g, (e) => {
            return '_' + e.toLowerCase();
        })
        .replace(/(__)/g, '_');
};