const {check, validationResult } = require("express-validator");


const validationRules = () => {
    return [
        check("oldPassword").trim().isLength({min: 7, max: 18}).withMessage
        ("Old Password must be been 7 and 18 characters"),

        check("newPassword").trim().isLength({min: 7, max: 18}).withMessage
        (" New Password must be been 7 and 18 characters")
    ]
};

const validate = (req, res, next) => {
    const errors = validationRules(req);

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