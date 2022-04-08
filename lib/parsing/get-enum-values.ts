export const getEnumValues = (currentType) => {
    let result = ""
    let integerValue = 0
    currentType.values.forEach(value => {
        result += value + ": {\n\tvalue: " + integerValue + "\n},"
        integerValue++
    })
    return result
}