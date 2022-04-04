"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.directives = void 0;
exports.directives = {
    selector: {
        name: 'selector',
        type: 'perform',
        runtime: false,
        resolve: function (givenField, types) {
            let result = [];
            types.forEach(type => {
                if (type.typeName === givenField.type) {
                    type.fields.forEach(field => {
                        if (field.directives.length > 0) {
                            field.directives.forEach((dir) => {
                                if (dir.name === this.name) {
                                    result.push(field.name);
                                }
                            });
                        }
                    });
                }
            });
            if (result.length === 0) {
                result.push('id');
            }
            return result;
        },
    },
    warn: {
        name: 'warn',
        type: 'perform',
        runtime: false,
        resolve: function () {
            console.log('simple warning');
        },
    },
};
