const createUserValidation = (user) => {
    const validationErrors = {};

    const validationRules = [
        {
            field: 'name',
            rules: [
                { test: typeof user.name !== 'string', message: 'Name is required and should be a string.' },
                { test: user.name.length < 3 || user.name.length > 20, message: 'Name should be between 3 and 20 characters.' },
                { test: /[^a-zA-Z0-9 ]/.test(user.name), message: 'Name should not contain special characters.' },
            ],
        },
        {
            field: 'age',
            rules: [
                { test: user.age === undefined || typeof user.age !== 'number', message: 'Age is required and should be a number.' },
                { test: user.age < 18 || user.age > 100, message: 'Age should be between 18 and 100.' },
            ],
        },
    ];

    validationRules.forEach((rule) => {
        rule.rules.forEach((validationRule) => {
            if (validationRule.test) {
                validationErrors[rule.field] = validationRule.message;
            }
        });
    });

    return Object.values(validationErrors);
};

export default createUserValidation;
