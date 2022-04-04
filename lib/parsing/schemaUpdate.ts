/** Fonction principale */
export const compareSchema = (old_schema, new_schema) => {
    let add_entities :any = []
    let drop_entities: any = []
    let update_entities :any = []
    for (let entity in new_schema) {
        if (entity !== "Query" && new_schema[entity].type !== "ScalarTypeDefinition" && entity !== "Mutation" && new_schema[entity].type !== "Mutation") {
            if (!old_schema[entity]) {
                add_entities.push(entity)
            } else {
                if (compareField(old_schema[entity].fields, new_schema[entity].fields) == false) {
                    update_entities.push(entity)
                }
            }
        }
    }
    for (let entity in old_schema) {
        if (entity !== "Query" && old_schema[entity].type !== "ScalarTypeDefinition" && entity !== "Mutation" && old_schema[entity].type !== "Mutation") {
            if (!new_schema[entity]) {
                drop_entities.push({name: entity})
            }
        }
    }
    console.log("Add entities : ", add_entities)
    console.log("Drop entities : ", drop_entities)
    console.log("Update entities : ", update_entities)
    let updates :any = [[], [], []]
    update_entities.forEach(x => {
        console.log("----- UPDATE ", x, " -----")
        let tmp = findDifferencesBetweenEntities(x, old_schema[x].fields, new_schema[x].fields)
        updates[0].push(tmp[0])
        updates[1].push(tmp[1])
        updates[2].push(tmp[2])
    })
    return [add_entities, updates, drop_entities]
}

/** Fonction principale */

const findDifferencesBetweenEntities = (name_entity, old_entity, new_entity) => {
    let add_fields :any = []
    let delete_fields :any = []
    let update_fields :any = []
    for (let field in new_entity) {
        if (containField(old_entity, new_entity[field].name) == false) {
            add_fields.push({name: name_entity, column: new_entity[field]})
        } else {
            if (compareFieldsForUpdate(old_entity, new_entity[field]) == false) {
                update_fields.push({
                    name: name_entity,
                    column_old: getField(old_entity, new_entity[field].name),
                    column_new: new_entity[field]
                })
            }
        }
    }
    for (let field in old_entity) {
        if (containField(new_entity, old_entity[field].name) == false) {
            if (old_entity[field].type === "String" || old_entity[field].type === "ID" || old_entity[field].type === "Boolean" || old_entity[field].type === "Int") {
                delete_fields.push({name: name_entity, column: old_entity[field].name})
            } else {
                delete_fields.push({
                    name: name_entity,
                    column: "Fk_" + old_entity[field].type + "_id"
                })
            }

        }
    }
    console.log("NEW FIELDS : ", add_fields)
    console.log("UPDATED FIELDS : ", update_fields)
    console.log("DELETED FIELDS : ", delete_fields)
    return [add_fields, update_fields, delete_fields]
}

const compareField = (old_entity, new_entity) => {

    for (let field in old_entity) {
        if (!new_entity[field]) {
            return false;
        }
        if (compareFieldsOfFields(old_entity[field], new_entity[field]) == false) {
            return false
        }
    }
    return true;
}

const compareFieldsOfFields = (old_field, new_field) => {
    for (let field in old_field) {
        if (field != "arguments") {
            if (old_field[field] != new_field[field]) {
                return false;
            }
        }
    }
    return true;
}

const compareFieldsForUpdate = (entity, field_check) => {
    for (let field in entity) {
        if (entity[field].name == field_check.name) {
            for (let sub_field in entity[field]) {
                if (sub_field != "arguments") {
                    if (entity[field][sub_field] != field_check[sub_field]) {
                        return false;
                    }
                }
            }
        }
    }
    return true;

}

const getField = (entity, fieldName) => {
    for (let field in entity) {
        if (entity[field].name == fieldName) {
            return entity[field]
        }
    }
    return undefined
}

const containField = (entity, fieldName) => {
    for (let field in entity) {
        if (entity[field].name == fieldName)
            return true

    }
    return false;
}


