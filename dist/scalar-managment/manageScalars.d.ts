import { Type } from "../models/Type";
export declare const isScalar: (typeName: string) => boolean;
export declare const isBasicType: (typeName: string) => boolean;
export declare const getFieldCreate: (type: string, name: string) => string;
export declare const getFieldName: (scalar: string, name: string, type: string) => string;
export declare const getScalarFieldInfo: (currentType: Type, typesNameArray: string[]) => any[];
