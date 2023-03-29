export const orderFieldsByWeight = (extraFields: any) => {
    extraFields = extraFields.sort((a: any, b: any) =>
        (a.order_weight && !b.order_weight) || (a.order_weight && b.order_weight && a.order_weight < b.order_weight)
            ? -1
            : 1
    );
    return extraFields;
};

export const addDefaultLabels = (extraFields: any) => {
    extraFields = extraFields.map((field: any) => {
        field['label'] = field['label'] ? field['label'] : field['name'];
        return field;
    });
    return extraFields;
};