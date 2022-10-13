export const directives = {
    selector: {
        name: 'selector',
        type: 'perform',
        runtime: false,
        resolve: function(givenField : any, types : any) : string[] {
            let result: string[] = []
            types.forEach(type => {
                if (type.typeName === givenField.type) {
                    type.fields.forEach(field => {
                        if (field.directives.length > 0) {
                            field.directives.forEach((dir) => {
                                if (dir.name === this.name) {
                                    result.push(field.name)
                                }
                            })
                        }
                    })
                }
            })
            if (result.length === 0) {
                result.push('id')
            }
            return result
        },
    },
    warn: {
        name: 'warn',
        type: 'perform',
        runtime: false,
        resolve: function() {
            console.log('simple warning')
        },
    },
    join: {
        name: 'Join',
        type: 'perform',
        runtime: false,
        resolve: function() {
            console.log('Joining type')
        },
    },
}