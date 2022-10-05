import {Type} from "./models/type";
import {getRelations} from "./parsing/relations-parsing";
import {schemaParser} from "./schema-parser/schemaParser";

const fs = require("fs");
const path = require("path");

const RESOURCE_FOLDER = '../test/resources/schema-graphql'
const JSON_FOLDER = '../test/resources/schema-json'
const TYPES_FOLDER = '../test/resources/schema-types'
const RELATIONS_FOLDER = '../test/resources/schema-relations'

let schemaGQL;
let schemaJSON;
let types;
let relations;

/**
 * Ce fichier sert a générer les types en fichier json à partir des schémas situés dans le dossier schema-graphql
 * Pour lancer cette méthode : npx ts-node lib/moulinette.ts
 */

fs.readdirSync(RESOURCE_FOLDER).forEach(file => {
    schemaGQL = fs.readFileSync(
        path.join(__dirname, RESOURCE_FOLDER, file),
        'utf8'
    );

    schemaJSON = schemaParser(schemaGQL);

    fs.writeFileSync(
        path.join(__dirname, JSON_FOLDER, file.replace(".graphql", "") + "-json.json"),
        JSON.stringify(schemaJSON)
    );

    types = Type.initTypes(schemaJSON);

    fs.writeFileSync(
        path.join(__dirname, TYPES_FOLDER, file.replace(".graphql", "") + "-types.json"),
        JSON.stringify(types)
    );

    relations = getRelations(types);

    fs.writeFileSync(
        path.join(__dirname, RELATIONS_FOLDER, file.replace(".graphql", "") + "-relations.json"),
        JSON.stringify(relations)
    );

});
