export declare const directives: {
    selector: {
        name: string;
        type: string;
        runtime: boolean;
        resolve: (givenField: any, types: any) => string[];
    };
    warn: {
        name: string;
        type: string;
        runtime: boolean;
        resolve: () => void;
    };
};
