const jwt = require("jsonwebtoken");

//-----------This function help in decoding the token and authenticates the user-----------
const validation = async function (req, res, next) {
    try {
        let token = req.headers['x-api-key'];
        let validate = jwt.verify(token, "radium");
        if (validate) {
            req.validate = validate
            next()
        }
        else {
            return res.status(200).send({ status: "false", msg: "Token is invalid" });
        }
    }
    catch (err) {
      return res.status(400).send({ msg:err.message });
    }
}
module.exports.validation = validation;