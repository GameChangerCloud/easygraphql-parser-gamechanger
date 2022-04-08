import fs from "fs";
import path from "path";
import {getRelations, getSQLTableName, isScalar, Relationships, schemaParser, Type} from "../../../lib";
import {expect} from "chai";
import util from 'util'

describe('getRelations', () => {

    let schema;
    let types;
    let entityTypes;
    let env = {"error": (str) => console.error(str)};

    const RELATIONS_FOLDER = '../../resources/parsing/get-relations-schema-graphql'
    const generateType = (schema) => Type.initTypes(schemaParser(schema))
    const getEntityAndScalarTypes = (types) => {
        entityTypes = types.filter(type => type.type === "ObjectTypeDefinition")
    }

    describe('OneOnly relationships', () => {
        it('Should return types with oneOnly relation', () => {
            //GIVEN
            schema = fs.readFileSync(
                path.join(__dirname, RELATIONS_FOLDER, 'one-only', 'one-only.graphql'),
                'utf8'
            );

            //WHEN
            types = generateType(schema);
            getEntityAndScalarTypes(types);
            let oneOnly = false;

            types = getRelations(entityTypes, env);

            //THEN
            types.forEach(type => {
                let relationList: any[] = [];
                type.fields.filter(field => !isScalar(field.type)).forEach(field => {
                    expect(field.relationType).to.exist
                    relationList.push({"type": field.type, "relation": field.relationType})
                    if (field.relationType === Relationships.oneOnly) {
                        oneOnly = true;
                        let foreign_key = {
                            "name": "Fk_" + field.name + "_" + field.name + "_id",
                            "type": field.sqlType,
                            "noNull": field.noNull,
                            "isArray": field.isArray,
                            "foreignKey": true,
                            "constraint": "FOREIGN KEY (\"Fk_" + field.name + "_" + field.name + "_id\") REFERENCES \"" + field.name + "\" (\"Pk_" + field.name + "_id\")"
                        }
                        expect(field.foreign_key).to.be.deep.equals(foreign_key)
                        expect(type.relationList).to.be.deep.equals(relationList)
                        expect(field.relation).to.be.true
                    }
                })
            })
            expect(oneOnly).to.equals(true, "No OneOnly Relation found. Check if your schema is right.")
        })
    })

    describe('ManyOnly relationships', () => {
        it('Should return types with ManyOnly relation', () => {
            //GIVEN
            schema = fs.readFileSync(
                path.join(__dirname, RELATIONS_FOLDER, 'many-only', 'many-only.graphql'),
                'utf8'
            );

            //WHEN
            types = generateType(schema);
            getEntityAndScalarTypes(types);
            let manyOnly = false;

            types = getRelations(entityTypes, env);

            //THEN
            types.forEach(type => {

                let relationList: any[] = [];

                type.fields.filter(field => !isScalar(field.type)).forEach(field => {
                    expect(field.relationType).to.exist
                    relationList.push({"type": field.type, "relation": field.relationType})
                    if (field.relationType === Relationships.manyOnly) {
                        manyOnly = true;
                        if (field.delegated_field.state) {
                            let delegatedField = {
                                state: true,
                                name: 'Fk_' + field.name + '_' + type.sqlTypeName + '_id',
                                type: 'Int',
                                foreign_key: {
                                    name: "Fk_" + field.name + "_" + type.sqlTypeName + "_id",
                                    type: field.sqlType,
                                    noNull: field.noNull,
                                    isArray: field.isArray,
                                    foreignKey: true
                                },
                                delegated_field: {
                                    associatedWith: {
                                        type: type.typeName,
                                        fieldName: field.name
                                    },
                                    side: "target"
                                }
                            }
                            expect(field.delegated_field.name).to.equals(delegatedField.name)
                            expect(field.delegated_field.type).to.equals(delegatedField.type)
                            expect(field.delegated_field.foreign_key).to.deep.equals(delegatedField.foreign_key)
                            expect(field.delegated_field.delegated_field).to.deep.equals(delegatedField.delegated_field)
                        } else {
                            let delegatedField = {
                                associatedWith: {
                                    type: field.type,
                                    fieldName: 'Fk_' + field.name + '_' + type.sqlTypeName + '_id'
                                },
                                side: "origin",
                                state: false
                            }
                            expect(field.delegated_field).to.deep.equals(delegatedField)
                        }
                        expect(field.relation).to.be.true
                        expect(field.in_model).to.be.false
                        expect(type.relationList).to.be.deep.equals(relationList)
                    }
                })
                expect(manyOnly).to.equals(true, "No ManyOnly Relation found. Check if your schema is right.")
            })
        })
    })

    describe('OneToOne relationships', () => {

        it('Should return types with selfJoinOne relation', () => {
            // GIVEN
            schema = fs.readFileSync(
                path.join(__dirname, RELATIONS_FOLDER, "one-to-one", "one-to-one-related-to-itself.graphql"),
                'utf8'
            );

            // WHEN
            types = generateType(schema);
            getEntityAndScalarTypes(types)
            let selfJoinOne = false;

            types = getRelations(entityTypes, env)

            // THEN
            types.forEach(type => {

                let relationList: any[] = [];

                type.fields.filter(field => !isScalar(field.type)).forEach(field => {
                    expect(field.relationType).to.exist
                    relationList.push({"type": field.type, "relation": field.relationType})
                    if (field.relationType === Relationships.selfJoinOne) {
                        selfJoinOne = true;
                        let foreign_key = {
                            "name": "Fk_" + field.name + "_" + getSQLTableName(field.type) + "_id",
                            "type": field.sqlType,
                            "noNull": field.noNull,
                            "isArray": field.isArray,
                            "foreignKey": true,
                            "constraint": 'FOREIGN KEY ("Fk_' + field.name + '_' + getSQLTableName(field.type)
                                + '_id") REFERENCES "' + getSQLTableName(field.type)
                                + '" ("Pk_' + getSQLTableName(field.type) + '_id")'
                        }
                        expect(field.foreign_key).to.be.deep.equals(foreign_key)
                        expect(type.relationList).to.be.deep.equals(relationList)
                        expect(field.relation).to.be.true
                    }
                })
            })
            expect(selfJoinOne).to.equals(true, "No SelfJoinOne Relation found. Check if your schema is right.")
        })

        it('Should return types with OneTone relation', () => {
            // GIVEN
            let schema = fs.readFileSync(
                path.join(__dirname, RELATIONS_FOLDER, "one-to-one", "one-to-one.graphql"),
                'utf8'
            );

            // WHEN
            let types = generateType(schema);
            getEntityAndScalarTypes(types)
            let oneToOne = false;
            types = getRelations(entityTypes, env)
            types.forEach(type => {

                let relationList: any[] = [];

                type.fields.filter(field => !isScalar(field.type)).forEach(field => {
                    expect(field.relationType).to.exist
                    relationList.push({"type": field.type, "relation": field.relationType})

                    if (field.relationType === Relationships.oneToOne) {
                        oneToOne = true;
                        let foreign_key = {
                            "name": "Fk_" + field.name + "_" + getSQLTableName(field.type) + "_id",
                            "type": field.sqlType,
                            "noNull": field.noNull,
                            "isArray": field.isArray,
                            "foreignKey": true,
                            "constraint": 'FOREIGN KEY ("Fk_' + field.name + '_' + getSQLTableName(field.type)
                                + '_id") REFERENCES "' + getSQLTableName(field.type)
                                + '" ("Pk_' + getSQLTableName(field.type) + '_id")'
                        }
                        expect(field.foreign_key).to.be.deep.equals(foreign_key)
                        expect(field.oneToOneInfo).to.be.deep.equals({"fkName": 'Fk_' + type.sqlTypeName + '_' + type.sqlTypeName + '_id'})
                        expect(type.relationList).to.be.deep.equals(relationList)
                        expect(field.relation).to.be.true
                    }
                })
            })
            expect(oneToOne).to.equals(true, "No OneToOne Relation found. Check if your schema is right.")
        })
    })

    describe('ManyToOne relationships', () => {
        it('Should return types with ManyToOne relation', () => {
            //GIVEN
            schema = fs.readFileSync(
                path.join(__dirname, RELATIONS_FOLDER, 'many-to-one', 'many-to-one.graphql'),
                'utf8'
            );

            //WHEN
            types = generateType(schema);
            getEntityAndScalarTypes(types);
            let manyToOne = false;

            types = getRelations(entityTypes, env);

            //THEN
            types.forEach(type => {

                let relationList: any[] = [];

                type.fields.filter(field => !isScalar(field.type)).forEach(field => {

                    expect(field.relationType).to.exist
                    relationList.push({"type": field.type, "relation": field.relationType})

                    if (field.relationType === Relationships.manyToOne) {
                        manyToOne = true;
                        if (field.delegated_field.state) {
                            let delegatedField = {
                                state: true,
                                name: 'Fk_' + field.name + '_' + getSQLTableName(field.type) + '_id',
                                type: 'Int',
                                foreign_key: {
                                    name: "Fk_" + field.name + "_" + getSQLTableName(field.type) + "_id",
                                    type: field.sqlType,
                                    noNull: field.noNull,
                                    isArray: field.isArray,
                                    foreignKey: true,
                                    constraint: 'FOREIGN KEY ("Fk_' + field.name + '_' + getSQLTableName(field.type) + '_id") REFERENCES "' + type.sqlTypeName + '" ("Pk_' + type.sqlTypeName + '_id")'
                                },
                                delegated_field: {
                                    associatedWith: {
                                        type: type.typeName,
                                        fieldName: field.name
                                    },
                                    side: "target"
                                }
                            }
                            expect(field.delegated_field.name).to.be.equals(delegatedField.name)
                            expect(field.delegated_field.type).to.be.equals(delegatedField.type)
                            expect(field.delegated_field.foreign_key).to.deep.equals(delegatedField.foreign_key)
                            expect(field.delegated_field.delegated_field).to.deep.equals(delegatedField.delegated_field)
                        } else {
                            let delegatedField = {
                                associatedWith: {
                                    type: field.type,
                                    fieldName: 'Fk_' + field.name + '_' + type.sqlTypeName + '_id'
                                },
                                side: "origin",
                                state: false
                            }
                            if (field.noNull) {
                                let joinTable = {
                                    state: true,
                                    name: type.typeName + '_' + field.type + '_' + field.name,
                                    contains: [
                                        {
                                            fieldName: field.name,
                                            type: field.type,
                                            constraint: 'FOREIGN KEY ("' + field.name + '_id") REFERENCES "' + getSQLTableName(field.type) + '" ("Pk_' + getSQLTableName(field.type) + '_id")'
                                        },
                                        {
                                            fieldName: type.typeName.toLowerCase(),
                                            type: type.typeName,
                                            constraint: 'FOREIGN KEY ("' + type.typeName.toLowerCase() + '_id") REFERENCES "' + type.sqlTypeName + '" ("Pk_' + type.sqlTypeName + '_id")'
                                        }]
                                }
                                expect(field.joinTable).to.deep.equals(joinTable)

                            }
                            expect(field.delegated_field).to.deep.equals(delegatedField)
                        }
                        expect(field.relation).to.be.true
                        expect(field.in_model).to.be.false
                        expect(type.relationList).to.be.deep.equals(relationList)
                    }
                    expect(manyToOne).to.equals(true, "No ManyToOne Relation found. Check if your schema is right.")
                })
            })
        })

        it('Should return types with ManyToOne relation with JoinTable', () => {
            //GIVEN
            schema = fs.readFileSync(
                path.join(__dirname, RELATIONS_FOLDER, 'many-to-one', 'many-to-one-joinTable.graphql'),
                'utf8'
            );

            //WHEN
            types = generateType(schema);
            getEntityAndScalarTypes(types);
            let manyToOne = false;

            types = getRelations(entityTypes, env);

            //THEN
            types.forEach(type => {

                let relationList: any[] = [];

                type.fields.filter(field => !isScalar(field.type)).forEach(field => {

                    expect(field.relationType).to.exist
                    relationList.push({"type": field.type, "relation": field.relationType})

                    if (field.relationType === Relationships.manyToOne) {
                        manyToOne = true;
                        if (field.delegated_field.state) {
                            let delegatedField = {
                                state: true,
                                name: 'Fk_' + field.name + '_' + getSQLTableName(field.type) + '_id',
                                type: 'Int',
                                foreign_key: {
                                    name: "Fk_" + field.name + "_" + getSQLTableName(field.type) + "_id",
                                    type: field.sqlType,
                                    noNull: field.noNull,
                                    isArray: field.isArray,
                                    foreignKey: true,
                                    constraint: 'FOREIGN KEY ("Fk_' + field.name + '_' + getSQLTableName(field.type) + '_id") REFERENCES "' + type.sqlTypeName + '" ("Pk_' + type.sqlTypeName + '_id")'
                                },
                                delegated_field: {
                                    associatedWith: {
                                        type: type.typeName,
                                        fieldName: field.name
                                    },
                                    side: "target"
                                }
                            }
                            expect(field.delegated_field.name).to.be.equals(delegatedField.name)
                            expect(field.delegated_field.type).to.be.equals(delegatedField.type)
                            expect(field.delegated_field.foreign_key).to.deep.equals(delegatedField.foreign_key)
                            expect(field.delegated_field.delegated_field).to.deep.equals(delegatedField.delegated_field)
                        } else {
                            let delegatedField = {
                                associatedWith: {
                                    type: field.type,
                                    fieldName: 'Fk_' + field.name + '_' + type.sqlTypeName + '_id'
                                },
                                side: "origin",
                                state: false
                            }

                            let joinTable = {
                                state: true,
                                name: type.typeName + '_' + field.type + '_' + field.name,
                                contains: [
                                    {
                                        fieldName: field.name,
                                        type: field.type,
                                        constraint: 'FOREIGN KEY ("' + field.name + '_id") REFERENCES "' + getSQLTableName(field.type) + '" ("Pk_' + getSQLTableName(field.type) + '_id")'
                                    },
                                    {
                                        fieldName: type.typeName.toLowerCase(),
                                        type: type.typeName,
                                        constraint: 'FOREIGN KEY ("' + type.typeName.toLowerCase() + '_id") REFERENCES "' + type.sqlTypeName + '" ("Pk_' + type.sqlTypeName + '_id")'
                                    }]
                            }
                            expect(field.joinTable).to.deep.equals(joinTable)
                            expect(field.delegated_field).to.deep.equals(delegatedField)
                        }
                        expect(field.relation).to.be.true
                        expect(field.in_model).to.be.false
                        expect(type.relationList).to.be.deep.equals(relationList)
                    }
                    expect(manyToOne).to.equals(true, "No ManyToOne Relation found. Check if your schema is right.")
                })
            })
        })
    })

    describe('OneToMany relationships', () => {
        it('should return OneToMany relationships', () => {
            //GIVEN
            schema = fs.readFileSync(
                path.join(__dirname, RELATIONS_FOLDER, 'one-to-many', 'one-to-many.graphql'),
                'utf8'
            );

            //WHEN
            types = generateType(schema);
            getEntityAndScalarTypes(types);
            let oneToMany = false;

            types = getRelations(entityTypes, env);

            //THEN
            types.forEach(type => {

                let relationList: any[] = [];

                type.fields.filter(field => !isScalar(field.type)).forEach(field => {

                    expect(field.relationType).to.exist
                    relationList.push({"type": field.type, "relation": field.relationType})

                    if (field.relationType === Relationships.oneToMany) {
                        oneToMany = true;
                        if (field.delegated_field.state) {
                            let delegatedField = {
                                state: true,
                                name: 'Fk_' + field.name + '_' + type.sqlTypeName + '_id',
                                type: 'Int',
                                foreign_key: {
                                    name: "Fk_" + field.name + "_" + type.sqlTypeName + "_id",
                                    type: field.sqlType,
                                    noNull: field.noNull,
                                    isArray: field.isArray,
                                    foreignKey: true,
                                    constraint: 'FOREIGN KEY ("Fk_' + field.name + '_' + type.sqlTypeName + '_id") REFERENCES "' + type.sqlTypeName + '" ("Pk_' + type.sqlTypeName + '_id")'
                                },
                                delegated_field: {
                                    associatedWith: {
                                        type: type.typeName,
                                        fieldName: field.name
                                    },
                                    side: "target"
                                }
                            }
                            expect(field.delegated_field.name).to.be.equals(delegatedField.name)
                            expect(field.delegated_field.type).to.be.equals(delegatedField.type)
                            expect(field.delegated_field.foreign_key).to.deep.equals(delegatedField.foreign_key)
                            expect(field.delegated_field.delegated_field).to.deep.equals(delegatedField.delegated_field)
                        } else {
                            let delegatedField = {
                                associatedWith: {
                                    type: field.type,
                                    fieldName: 'Fk_' + field.name + '_' + type.sqlTypeName + '_id'
                                },
                                side: "origin",
                                state: false
                            }
                            expect(field.delegated_field).to.deep.equals(delegatedField)
                        }
                        expect(field.relation).to.be.true
                        expect(field.in_model).to.be.false
                        expect(type.relationList).to.be.deep.equals(relationList)
                    }
                    expect(oneToMany).to.equals(true, "No OneToMany Relation found. Check if your schema is right.")
                })
            })
        })
    })

    describe('ManyToMany relationships', () => {

        it('should return SelfJoinMany relationships', () => {
            //GIVEN
            schema = fs.readFileSync(
                path.join(__dirname, RELATIONS_FOLDER, 'many-to-many', 'many-to-many-self-join-many.graphql'),
                'utf8'
            );

            //WHEN
            types = generateType(schema);
            getEntityAndScalarTypes(types);
            let manyToMany = false;

            types = getRelations(entityTypes, env);

            //THEN
            types.forEach(type => {

                let relationList: any[] = [];

                type.fields.filter(field => !isScalar(field.type)).forEach(field => {

                    expect(field.relationType).to.exist
                    relationList.push({"type": field.type, "relation": field.relationType})

                    if (field.relationType === Relationships.selfJoinMany) {
                        manyToMany = true;
                        let joinTable = {
                            state: true,
                            name: type.typeName + '_' + field.type + '_' + field.name,
                            contains: [
                                {
                                    fieldName: field.name.toLowerCase(),
                                    type: field.type,
                                    constraint: 'FOREIGN KEY ("' + field.name.toLowerCase() + '_id") REFERENCES "' + getSQLTableName(field.type) + '" ("Pk_' + getSQLTableName(field.type) + '_id")'
                                },
                                {
                                    fieldName: field.type.toLowerCase(),
                                    type: field.type,
                                    constraint: 'FOREIGN KEY ("' + getSQLTableName(field.type) + '_id") REFERENCES "' + getSQLTableName(field.type) + '" ("Pk_' + getSQLTableName(field.type) + '_id")'
                                }
                            ]
                        }
                        expect(type.relationList).to.be.deep.equals(relationList);
                        expect(field.relation).to.be.true;
                        expect(field.activeSide).to.be.true;
                        expect(field.joinTable).to.be.deep.equals(joinTable);
                        expect(field.in_model).to.be.false;
                    }
                })
            })
        })

        it('should return ManyToMany hasInverse Directive relationships', () => {
            //GIVEN
            schema = fs.readFileSync(
                path.join(__dirname, RELATIONS_FOLDER, 'many-to-many', 'many-to-many-has-inverse.graphql'),
                'utf8'
            );

            //WHEN
            types = generateType(schema);
            getEntityAndScalarTypes(types);
            let manyToMany = false;

            types = getRelations(entityTypes, env);

            //THEN
            types.forEach(type => {

                let relationList: any[] = [];

                type.fields.filter(field => !isScalar(field.type)).forEach(field => {

                    expect(field.relationType).to.exist

                    if (field.relationType === Relationships.manyToMany) {
                        manyToMany = true;
                        if (field.directives.length > 0 && field.directives.find(directive => directive.name == 'hasInverse') != undefined) {
                            relationList.push({"type": field.type, "relation": field.relationType})

                            let joinTable = {
                                state: true,
                                name: type.typeName + '_' + field.type + '_' + field.name,
                                contains: [
                                    {
                                        fieldName: field.name.toLowerCase(),
                                        type: field.type,
                                        constraint: 'FOREIGN KEY ("' + field.name.toLowerCase() + '_id") REFERENCES "' + getSQLTableName(field.type) + '" ("Pk_' + getSQLTableName(field.type) + '_id")'
                                    },
                                    {
                                        fieldName: type.typeName.toLowerCase(),
                                        type: type.typeName,
                                        constraint: 'FOREIGN KEY ("' + type.typeName.toLowerCase() + '_id") REFERENCES "' + getSQLTableName(type.typeName) + '" ("Pk_' + getSQLTableName(type.typeName) + '_id")'
                                    }
                                ]
                            }
                            expect(type.relationList).to.be.deep.equals(relationList);
                            expect(field.relation).to.be.true;
                            expect(field.activeSide).to.be.true;
                            expect(field.joinTable).to.be.deep.equals(joinTable);
                            expect(field.in_model).to.be.false;
                        }
                    }
                })
            })
        })

        it('should return ManyToMany relationships', () => {
            //GIVEN
            schema = fs.readFileSync(
                path.join(__dirname, RELATIONS_FOLDER, 'many-to-many', 'many-to-many.graphql'),
                'utf8'
            );

            //WHEN
            types = generateType(schema);
            getEntityAndScalarTypes(types);
            let manyToMany = false;

            types = getRelations(entityTypes, env);

            //THEN
            types.forEach(type => {

                let relationList: any[] = [];

                type.fields.filter(field => !isScalar(field.type)).forEach(field => {

                    expect(field.relationType).to.exist
                    relationList.push({"type": field.type, "relation": field.relationType})

                    if (field.relationType === Relationships.manyToMany) {
                        manyToMany = true;
                        let joinTable = {
                            state: true,
                            name: type.typeName + '_' + field.type + '_' + field.name,
                            contains: [
                                {
                                    fieldName: field.name.toLowerCase(),
                                    type: field.type,
                                    constraint: 'FOREIGN KEY ("' + field.name.toLowerCase() + '_id") REFERENCES "' + getSQLTableName(field.type) + '" ("Pk_' + getSQLTableName(field.type) + '_id")'
                                },
                                {
                                    fieldName: type.typeName.toLowerCase(),
                                    type: type.typeName,
                                    constraint: 'FOREIGN KEY ("' + type.typeName.toLowerCase() + '_id") REFERENCES "' + getSQLTableName(type.typeName) + '" ("Pk_' + getSQLTableName(type.typeName) + '_id")'
                                }
                            ]
                        }
                        expect(type.relationList).to.be.deep.equals(relationList);
                        expect(field.relation).to.be.true;
                        expect(field.joinTable).to.be.deep.equals(joinTable);
                        expect(field.in_model).to.be.false;
                    }
                })
            })
        })
    })
})
