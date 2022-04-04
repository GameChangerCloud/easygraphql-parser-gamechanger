import {mapSchema, getDirectives, MapperKind} from '@graphql-tools/utils'
import {GraphQLEnumValueConfig, GraphQLFieldConfig} from "graphql";

export function deprecatedDirective(directiveName: string) {
    return {
        deprecatedDirectiveTypeDefs: `directive @${directiveName}(reason: String) on FIELD_DEFINITION | ENUM_VALUE`,
        deprecatedDirectiveTransformer: (schema) =>
            mapSchema(schema, {
                [MapperKind.OBJECT_FIELD]: (fieldConfig): GraphQLFieldConfig<any, any> | undefined => {
                    const directives = getDirectives(schema, fieldConfig)
                    const directiveArgumentMap = directives[directiveName]
                    if (directiveArgumentMap) {
                        fieldConfig.deprecationReason = directiveArgumentMap.reason
                        return fieldConfig
                    }
                },
                [MapperKind.ENUM_VALUE]: (enumValueConfig): GraphQLEnumValueConfig | undefined => {
                    const directives = getDirectives(schema, enumValueConfig)
                    const directiveArgumentMap = directives[directiveName]
                    if (directiveArgumentMap) {
                        enumValueConfig.deprecationReason = directiveArgumentMap.reason
                        return enumValueConfig
                    }
                },
            }),
    }
}