"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatName = void 0;
const formatName = (name) => {
    return name.replace(/[^a-z]/gi, '');
};
exports.formatName = formatName;
