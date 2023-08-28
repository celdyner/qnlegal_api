const {check, validationResult } = require("express-validator");


const validationRules = () => {
    return [
        check("email").trim().isEmail().normalizeEmail().withMessage
        ("Please enter a valid email"),
        check("name").trim().isLength({min: 1, max: 20}).withMessage
        ("Title must be between 1 and 20 characters long"),
        check("password").trim().isLength({min: 7, max: 18}).withMessage
        ("Password must be been 7 and 18 characters")

    ]
};

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if(errors.isEmpty()) {
        return next();
    }

    const resultErrors = [];
    errors.array().map((err) => resultErrors.push({[err.param]: err.messsage}));
       
    resultErrors.push({message: "Action unsuccessful"});
    resultErrors.push({succcess: false});

    const errorObject = Object.assign({}, ...resultErrors);
    return res.status(422).json(errorObject);


};

module.exports = {
    validationRules,
    validate
}