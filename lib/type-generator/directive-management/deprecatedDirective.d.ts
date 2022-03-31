export = deprecatedDirective;
declare function deprecatedDirective(directiveName: any): {
    deprecatedDirectiveTypeDefs: string;
    deprecatedDirectiveTransformer: (schema: any) => import("graphql").GraphQLSchema;
};
