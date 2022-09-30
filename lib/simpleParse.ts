import { exit } from "process";
import {Type} from "./models/type";
import {getRelations} from "./parsing/relations-parsing";
import {schemaParser} from "./schema-parser/schemaParser";

const fs = require("fs");

let schemaGQL;
let schemaJSON;
let types;
let relations;

/**
 * Ce fichier sert a générer les types en fichier json à partir des schémas situés dans le dossier schema-graphql
 * Pour lancer cette méthode : npx ts-node lib/moulinette.ts
 */

 const myArgs = process.argv.slice(2);
 if (myArgs.length == 0) {
    console.log("Provide a full path to a graphQL file");
    exit(0)
 }

    schemaGQL = fs.readFileSync(
        myArgs[0],
        'utf8'
    );

schemaJSON = schemaParser(schemaGQL);

types = Type.initTypes(schemaJSON);

relations = getRelations(types);

console.log(JSON.stringify(relations));
