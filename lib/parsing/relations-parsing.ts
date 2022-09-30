/** Fonctions principales */
import {Relationships} from "../constants/relationships";
import {getSQLTableName} from "../utils/get-sql-table-name";
import {Type} from "../models/type";
import {Field, IField} from "../models/field";
import {isScalar} from "../scalar-managment/manage-scalars";
import {OneToOneRelationNotAllowedError} from "./error/one-to-one-not-allowed";

/**
 *  Compute relationships oneToMany, manyToMany, etc..
 * @param {*} types contains all types with associated attributes read from easygraphql-parser
 * @returns
 */
export const getRelations = (types: Type[]) => {
    let manyToMany: any[] = [];
    let targetSQLTypeName: string;
    let currentSQLTypeName: string;
    let targetType: Type | undefined;
    types.filter(type => type.type === "ObjectTypeDefinition" && type.isNotOperation())
        .forEach(currentType => {
            let relationalFields = currentType.fields.filter(field => !isScalar(field.type))
            relationalFields.forEach(relationalField => {
                let inn = relationalField.isArray ? 2 : 1;
                let out = getRelationOf(relationalField.type, types, currentType.typeName);
                switch (true) {     //Switch true to check multiple arguments
                    /** OneOnly relationships **/
                    case inn === 1 && out === 0:
                        currentType.relationList.push({
                            type: relationalField.type,
                            relation: Relationships.oneOnly
                        });

                        targetSQLTypeName = getSQLTableName(relationalField.type);
                        relationalField.relation = true;
                        relationalField.relationType = Relationships.oneOnly;
                        relationalField.foreign_key = {
                            name: `Fk_${relationalField.name}_${targetSQLTypeName}_id`,
                            type: "int",
                            noNull: relationalField.noNull,
                            isForeignKey: true,
                            constraint: `FOREIGN KEY ("Fk_${relationalField.name}_${targetSQLTypeName}_id") REFERENCES "${targetSQLTypeName}" ("Pk_${targetSQLTypeName}_id")`
                        };
                        break;
                    /** OneToOne || SelfJoinOne relationships **/
                    case inn === 1 && out === 1:
                        if (relationalField.type === currentType.typeName) {
                            currentType.relationList.push({
                                type: relationalField.type,
                                relation: Relationships.selfJoinOne
                            });

                            targetSQLTypeName = getSQLTableName(relationalField.type);
                            relationalField.relation = true;
                            relationalField.relationType = Relationships.selfJoinOne;
                            relationalField.foreign_key = {
                                name: `Fk_${relationalField.name}_${targetSQLTypeName}_id`,
                                type: "int",
                                noNull: relationalField.noNull,
                                isForeignKey: true,
                                constraint: `FOREIGN KEY ("Fk_${relationalField.name}_${targetSQLTypeName}_id") REFERENCES "${targetSQLTypeName}" ("Pk_${targetSQLTypeName}_id")`
                            };
                        } else {
                            let targetedType = types.find(type => type.typeName === relationalField.type)
                            let targetField = targetedType?.fields.find(field => field.type === currentType.typeName)

                            if (targetField?.noNull && relationalField.noNull) {
                                throw new OneToOneRelationNotAllowedError()
                            }

                            currentType.relationList.push({
                                type: relationalField.type,
                                relation: Relationships.oneToOne
                            })

                            if (!targetField?.oneToOneInfo) {
                                targetSQLTypeName = getSQLTableName(relationalField.type)
                                relationalField.relation = true;
                                relationalField.relationType = Relationships.oneToOne
                                relationalField.foreign_key = {
                                    name: `Fk_${relationalField.name}_${targetSQLTypeName}_id`,
                                    type: "int",
                                    noNull: relationalField.noNull,
                                    isForeignKey: true,
                                    constraint: `FOREIGN KEY ("Fk_${relationalField.name}_id") REFERENCES "${targetSQLTypeName}"`
                                }
                                relationalField.oneToOneInfo = `Fk_${relationalField.name}_${targetSQLTypeName}_id`
                            }
                        }
                        break;
                    /** OneToMany relationships **/
                    case inn === 1 && out === 2:
                        currentType.relationList.push({
                            type: relationalField.type,
                            relation: Relationships.oneToMany
                        });

                        targetSQLTypeName = getSQLTableName(relationalField.type)
                        relationalField.relation = true;
                        relationalField.relationType = Relationships.oneToMany;
                        relationalField.foreign_key = {
                            name: `Fk_${relationalField.name}_${targetSQLTypeName}_id`,
                            type: "int",
                            noNull: relationalField.noNull,
                            isForeignKey: true,
                            constraint: `FOREIGN KEY ("Fk_${relationalField.name}_${targetSQLTypeName}_id") REFERENCES "${targetSQLTypeName}" ("Pk_${targetSQLTypeName}_id")`
                        };
                        break;
                    /** ManyOnly relationships **/
                    case inn === 2 && out === 0:
                        currentType.relationList.push({
                            type: relationalField.type,
                            relation: Relationships.manyOnly
                        });

                        targetSQLTypeName = getSQLTableName(relationalField.type);
                        currentSQLTypeName = getSQLTableName(currentType.typeName)

                        relationalField.relation = true;
                        relationalField.relationType = Relationships.manyOnly;

                        // Foreign key field that will be added to the target type
                        let addedForeignKeyField: Field = JSON.parse(JSON.stringify(relationalField))

                        // delegate object completion
                        relationalField.delegated_field.side = "origin";
                        relationalField.delegated_field.associatedWith.type = relationalField.type;
                        relationalField.delegated_field.associatedWith.fieldName = `Fk_${relationalField.name}_${currentSQLTypeName}_id`;

                        // Field does not appear in model
                        relationalField.in_model = false

                        addedForeignKeyField.name = `Fk_${relationalField.name}_${currentSQLTypeName}_id`
                        addedForeignKeyField.type = "Int";
                        addedForeignKeyField.isArray = false;
                        addedForeignKeyField.noNull = relationalField.noNullArrayValues

                        addedForeignKeyField.foreign_key = {
                            name: `Fk_${relationalField.name}_${currentSQLTypeName}_id`,
                            type: "int",
                            noNull: relationalField.noNullArrayValues,
                            isForeignKey: true,
                            constraint: `FOREIGN KEY ("Fk_${relationalField.name}_${currentSQLTypeName}_id") REFERENCES "${currentSQLTypeName}" ("Pk_${currentSQLTypeName}_id")`
                        }

                        addedForeignKeyField.delegated_field.state = true;
                        addedForeignKeyField.delegated_field.side = "target";
                        addedForeignKeyField.delegated_field.associatedWith.type = currentType.typeName;
                        addedForeignKeyField.delegated_field.associatedWith.fieldName = relationalField.name;


                        //targetType = types.find(type => type.typeName === relationalField.type)
                        //targetType?.fields.push(addedForeignKeyField);
                        break;
                    /** ManyToOne **/
                    case inn === 2 && out === 1:
                        currentType.relationList.push({
                            type: relationalField.type,
                            relation: Relationships.manyToOne
                        });

                        relationalField.relation = true;
                        relationalField.relationType = Relationships.manyToOne;
                        relationalField.in_model = false;
                        break;
                    /** ManyToMany | SelfJoinMany **/
                    case inn === 2 && out === 2:
                        targetSQLTypeName = getSQLTableName(relationalField.type)
                        currentSQLTypeName = getSQLTableName(currentType.typeName)

                        if (relationalField.type === currentType.typeName) {
                            currentType.relationList.push({
                                type: relationalField.type,
                                relation: Relationships.selfJoinMany
                            });

                            relationalField.relationType = Relationships.selfJoinMany;

                            relationalField.joinTable.state = true;
                            relationalField.joinTable.name = `${currentType.typeName}_${currentType.typeName}_${relationalField.name}`;
                            relationalField.joinTable.contains.push({
                                fieldName: `${currentSQLTypeName}1_id`,
                                type: relationalField.type,
                                constraint: `FOREIGN KEY ("${currentSQLTypeName}1_id") REFERENCES "${targetSQLTypeName}" ("Pk_${targetSQLTypeName}_id")`
                            });
                            relationalField.joinTable.contains.push({
                                fieldName: `${currentSQLTypeName}2_id`,
                                type: currentType.typeName,
                                constraint: `FOREIGN KEY ("${currentSQLTypeName}2_id") REFERENCES "${currentSQLTypeName}" ("Pk_${currentSQLTypeName}_id")`
                            });
                        } else {
                            currentType.relationList.push({
                                type: relationalField.type,
                                relation: Relationships.manyToMany
                            });

                            relationalField.relationType = Relationships.manyToMany;

                            targetType = types.find(type => type.typeName === relationalField.type);
                            let targetField = targetType?.fields.find(field => field.type === currentType.typeName);

                            // If the joinTable exists from the other entity we don't need to create a new one
                            let alreadyDefinedRelation = manyToMany.filter(relation => relation.field === targetField?.name && relationalField.name === relation.target)
                            if (alreadyDefinedRelation[0]) {
                                relationalField.joinTable = targetField?.joinTable;
                            } else {
                                let jointTableName = `${currentType.typeName}_${relationalField.type}_${relationalField.name}`
                                manyToMany.push({
                                    name: jointTableName,
                                    field: relationalField.name,
                                    target: targetField?.name
                                })

                                relationalField.joinTable.state = true;
                                relationalField.joinTable.name = jointTableName;
                                relationalField.joinTable.contains.push({
                                    fieldName: `${targetSQLTypeName}_id`,
                                    type: relationalField.type,
                                    constraint: `FOREIGN KEY ("${targetSQLTypeName}_id") REFERENCES "${targetSQLTypeName}" ("Pk_${targetSQLTypeName}_id")`
                                });
                                relationalField.joinTable.contains.push({
                                    fieldName: `${currentSQLTypeName}_id`,
                                    type: currentType.typeName,
                                    constraint: `FOREIGN KEY ("${currentSQLTypeName}_id") REFERENCES "${currentSQLTypeName}" ("Pk_${currentSQLTypeName}_id")`
                                });
                            }
                        }
                        relationalField.relation = true;
                        relationalField.in_model = false
                        break;
                }
            })
        })
    return types
}

/**
 * Build the list of join tables to add to the schema on top of standard object
 *
 * @returns Tables description
 * @param types
 */
export const getJoinTables = (types: Type[]) => {
    let results: any = []

    types.forEach(currentType => {
        if (currentType.isNotOperation()) {
            currentType.fields.filter(field => field.relationType == Relationships.selfJoinMany || field.relationType == Relationships.manyToMany && field.joinTable.state)
                .forEach(relationalField => {
                    //Check if jointable already existing
                    let alreadyExisting = results.filter(result => result.name === relationalField.joinTable.name)
                    if (alreadyExisting[0]) {
                        return
                    }
                    let joinTableColumns = relationalField.joinTable.contains.map(column => {
                        return {
                            field: column.fieldName,
                            fieldType: 'int',
                            constraint: column.constraint
                        }
                    });

                    results.push({
                        name: relationalField.joinTable.name,
                        sqlName: relationalField.joinTable.name.toLowerCase(),
                        columns: joinTableColumns,
                        isJoinTable: true
                    })
                })
        }
    })
    return results
}

export const getQuerySelfJoinOne = (currentTypeName, fields) => {
    let result = ""
    fields.forEach(field => {
        if (field.type === currentTypeName) {
            result += "SELECT * FROM \"" + currentTypeName + "\" as t1 WHERE t1.\"Pk_Employe_id\" = (SELECT \"" + field.name.toLowerCase() + "_id\" FROM  \"" + currentTypeName + "\" WHERE \"" + currentTypeName + "\".\"Pk_" + currentTypeName + "_id\" = :value)"
        }
    })
    return result
}

export const getQuerySelfJoinMany = (currentTypeName, fields) => {
    let result = ""
    fields.forEach(field => {
        if (field.type === currentTypeName) {
            result += "SELECT t2.* FROM \"" + currentTypeName + "\" as t1 LEFT OUTER JOIN \"" + currentTypeName + "_" + field.name.toLowerCase() + "\" as joint ON t1.\"Pk_" + currentTypeName + "_id\" = joint.\"" + currentTypeName.toLowerCase() + "_id\" LEFT OUTER JOIN \"" + currentTypeName + "\" as t2 ON joint." + field.name.toLowerCase() + "_id = t2.\"Pk_" + currentTypeName + "_id\" WHERE t1.\"Pk_" + currentTypeName + "_id\" = :value '+sorting+' '+limit+' '+offset"
        }
    })
    return result
}

/** Fonctions utilitaires */

/**
 *
 * @param {*} fields Fields of the targeted object
 * @param {*} currentTypeName TypeName being inspected
 * @returns 2 if relationship is [Type], 1 if relationship is Type, 0 if no relationship
 * @description Doesn't work if there is several time the same type referenced in the fileds !
 */
const getManyOrOne = (fields: IField[], currentTypeName: string) => {
    for (let field of fields) {
        if (field.type === currentTypeName) {
            return field.isArray ? 2 : 1;
        }
    }
    return 0;
}

/**
 *
 * @param {*} targetTypeName : Target type for the relation
 * @param {*} types : Types defined in the schema
 * @param {*} currentTypeName : Current Type being processed
 * @returns : 2 if relationship is [Type], 1 if relationship is Type, 0 if no relationship
 */
const getRelationOf = (targetTypeName: string, types: Type[], currentTypeName: string) => {
    for (let type of types) {
        if (type.typeName === targetTypeName) {
            return getManyOrOne(type.fields, currentTypeName)
        }
    }
    return 0;
};