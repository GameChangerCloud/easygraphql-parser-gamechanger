"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deprecatedDirective = void 0;
const utils_1 = require("@graphql-tools/utils");
function deprecatedDirective(directiveName) {
    return {
        deprecatedDirectiveTypeDefs: `directive @${directiveName}(reason: String) on FIELD_DEFINITION | ENUM_VALUE`,
        deprecatedDirectiveTransformer: (schema) => (0, utils_1.mapSchema)(schema, {
            [utils_1.MapperKind.OBJECT_FIELD]: (fieldConfig) => {
                const directives = (0, utils_1.getDirectives)(schema, fieldConfig);
                const directiveArgumentMap = directives[directiveName];
                if (directiveArgumentMap) {
                    fieldConfig.deprecationReason = directiveArgumentMap.reason;
                    return fieldConfig;
                }
            },
            [utils_1.MapperKind.ENUM_VALUE]: (enumValueConfig) => {
                const directives = (0, utils_1.getDirectives)(schema, enumValueConfig);
                const directiveArgumentMap = directives[directiveName];
                if (directiveArgumentMap) {
                    enumValueConfig.deprecationReason = directiveArgumentMap.reason;
                    return enumValueConfig;
                }
            },
        }),
    };
}
exports.deprecatedDirective = deprecatedDirective;
