import {directives} from "../constants/directives";

export const getDirectivesNames = () =>{
    let names : any = []
    for( let elem in directives ){
        names.push(elem)
    }
    console.log(names)
    return names
}