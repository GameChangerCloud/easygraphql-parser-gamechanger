import UserType = require("../types/userType");
import { GraphQLNonNull } from "graphql";
export { UserType as type };
export declare namespace args {
    namespace input {
        const type: GraphQLNonNull<import("graphql").GraphQLNullableType>;
    }
}
export declare function resolve(obj: any, { input }: {
    input: any;
}, ctx: any): Promise<{
    email: any;
    username: any;
    fullName: any;
}>;
