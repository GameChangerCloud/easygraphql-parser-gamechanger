

const{ mapSchema, getDirectives, MapperKind } = require("@graphql-tools/utils");

function deprecatedDirective(directiveName) {
  return {
    deprecatedDirectiveTypeDefs: `directive @${directiveName}(reason: String) on FIELD_DEFINITION | ENUM_VALUE`,
    deprecatedDirectiveTransformer: (schema) => mapSchema(schema, {
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
        const directives = getDirectives(schema, fieldConfig);
        const directiveArgumentMap = directives[directiveName];
        if (directiveArgumentMap) {
          fieldConfig.deprecationReason = directiveArgumentMap.reason;
          return fieldConfig;
        }
      },
      [MapperKind.ENUM_VALUE]: (enumValueConfig) => {
        const directives = getDirectives(schema, enumValueConfig);
        const directiveArgumentMap = directives[directiveName];
        if (directiveArgumentMap) {
          enumValueConfig.deprecationReason = directiveArgumentMap.reason;
          return enumValueConfig;
        }
      }
    }),
  };
}

module.exports = deprecatedDirective