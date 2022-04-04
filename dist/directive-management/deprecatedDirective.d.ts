export declare function deprecatedDirective(directiveName: string): {
    deprecatedDirectiveTypeDefs: string;
    deprecatedDirectiveTransformer: (schema: any) => import("graphql").GraphQLSchema;
};
