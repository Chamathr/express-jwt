const conf = require('../config/auth.config')
const jwt = require('jsonwebtoken');

exports.authenticateToken = async (req, res, next) => {
    
    try{
        const token = req.headers["authorization"];

        if (!token) {
            return res.status(403).send({
            message: "No token provided!"
            });
        }

        jwt.verify(token, conf.secret, (err, decoded) => {
            if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
            }
            next();
        });
        }
    catch(error){
        res.status(500).json({error})
    }
  
}
