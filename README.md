# graphql-parser-gamechanger
json parser form grapqhl schema based on easygrapqhl-parser

## Installation

```bash
$ npm install easygraphql-parser
```

## Specification
This parser is based on easygraphql-parser From EasyGraphql. It extends its use to manage both field directives and type directives

```gql
actors: [Actor] @hasInverse(field: movies)
```
the parser can now handle more than the 3 native graphql directives ( @include, @skip and @deprecated). it now includes detailed info about custom directives
and their arguments :
- directive name : hasInverse
- directive arguments : field 
        
       - value : movies


## Get Started

this will be our schema in a folder named _graphql-examples_ and file named _movies.graphql_ :

```gql
type Movie {
  id: ID!
  title: String @search
  actors: [Actor] @hasInverse(field: movies)
  studio: Studio!
}

type Actor {
  id: ID!
  name: String
  movies: [Movie]
}

type Studio {
  id: ID!
  name: String!
}
```
You can generate the json schema which represents the above graphql schema by following the next steps:

```js
const fs = require('fs')
const path = require('path')
const easygraphqlSchemaParser = require('easygraphql-parser-gamechanger')

const schemaCode = fs.readFileSync(path.join(__dirname, './graphql-examples', 'movies.graphql'), 'utf8')


schemaJSON = easygraphqlSchemaParser(schema)

```

the output schema has this form

```js
{
  "Movie": {
    "type": "ObjectTypeDefinition",
    "fields": [
      {
        "name": "id",
        "arguments": [],
        "isDeprecated": false,
        "directives": [],
        "noNull": true,
        "isArray": false,
        "noNullArrayValues": false,
        "type": "ID"
      },
      {
        "name": "title",
        "arguments": [],
        "isDeprecated": false,
        "directives": [
          {
            "name": "search",
            "args": []
          }
        ],
        "noNull": false,
        "isArray": false,
        "noNullArrayValues": false,
        "type": "String"
      },
      {
        "name": "actors",
        "arguments": [],
        "isDeprecated": false,
        "directives": [
          {
            "name": "hasInverse",
            "args": [
              {
                "name": "field",
                "value": "movies"
              }
            ]
          }
        ],
        "noNull": false,
        "isArray": true,
        "noNullArrayValues": false,
        "type": "Actor"
      },
      {
        "name": "studio",
        "arguments": [],
        "isDeprecated": false,
        "directives": [],
        "noNull": true,
        "isArray": false,
        "noNullArrayValues": false,
        "type": "Studio"
      }
    ],
    "values": [],
    "types": [],
    "implementedTypes": [],
    "directives": []
  },
  "Actor": {
    "type": "ObjectTypeDefinition",
    "fields": [
      {
        "name": "id",
        "arguments": [],
        "isDeprecated": false,
        "directives": [],
        "noNull": true,
        "isArray": false,
        "noNullArrayValues": false,
        "type": "ID"
      },
      {
        "name": "name",
        "arguments": [],
        "isDeprecated": false,
        "directives": [],
        "noNull": false,
        "isArray": false,
        "noNullArrayValues": false,
        "type": "String"
      },
      {
        "name": "movies",
        "arguments": [],
        "isDeprecated": false,
        "directives": [],
        "noNull": false,
        "isArray": true,
        "noNullArrayValues": false,
        "type": "Movie"
      }
    ],
    "values": [],
    "types": [],
    "implementedTypes": [],
    "directives": []
  },
  "Studio": {
    "type": "ObjectTypeDefinition",
    "fields": [
      {
        "name": "id",
        "arguments": [],
        "isDeprecated": false,
        "directives": [],
        "noNull": true,
        "isArray": false,
        "noNullArrayValues": false,
        "type": "ID"
      },
      {
        "name": "name",
        "arguments": [],
        "isDeprecated": false,
        "directives": [],
        "noNull": true,
        "isArray": false,
        "noNullArrayValues": false,
        "type": "String"
      }
    ],
    "values": [],
    "types": [],
    "implementedTypes": [],
    "directives": []
  }
}
```

we get a json object representing the graphql schema of movies. now we can easily acces to fields (names, directives, non null constraint, etc...)

# Tester vos modifications 
###### tags: `GameChanger`

Pour tester la migration faites des fonctions/constantes/classes utilitaires concernant le gestion du type des schemas etc.

## Easygraphql-parser-gamechanger

Cloner le repo github
```
https://github.com/GameChangerCloud/easygraphql-parser-gamechanger.git
```
Une fois le repo cloné. Ne pas oublier oublier d'installer les dépendances :
```
npm i
```

Une fois cela fait la prochaine étape consiste à link cette version du parser à vos `node_modules` en utilisant :
```
npm link
```

## Générateur AWS

Cloner le repo github
```
https://github.com/GameChangerCloud/generator-aws-server-gamechanger.git
```
Une fois le repo cloné. Ne pas oublier oublier d'installer les dépendances :
```
npm i
```

Une fois cela fait la prochaine étape consiste à link cette version du générateur à vos `node_modules` en utilisant :
```
npm link
```
Il vous faudra ensuite vous link à la version d'`easygraphql-parser-gamechanger`, que vous avez link juste avant, en utilisant :
```
npm link "easygraphql-parser-gamechanger"
```

## Générateur React

Cloner le repo github
```
https://github.com/GameChangerCloud/generator-react-client-gamechanger.git
```
Une fois le repo cloné. Ne pas oublier oublier d'installer les dépendances :
```
npm i
```

Une fois cela fait la prochaine étape consiste à link cette version du générateur à vos `node_modules` en utilisant :
```
npm link
```
Il vous faudra ensuite vous link à la version d'`easygraphql-parser-gamechanger`, que vous avez link juste avant, en utilisant :
```
npm link "easygraphql-parser-gamechanger"
```

## Vous êtes prêt

Une fois ces étapes réalisées, vous êtes prêt à tester en lançant une génération. Cette dernière va alors utiliser les modules que vous avez link.