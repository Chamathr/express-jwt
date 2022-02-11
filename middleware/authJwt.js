const conf = require('../config/auth.config')
const jwt = require('jsonwebtoken');

exports.authenticateToken = async (req, res, next) => {
    
    try{
        const token = req.headers["authorization"];

        if (!token) {
            return res.status(403).send({
            message: "No token provided!"
            });
        }else{
            jwt.verify(token, conf.secret, (err, decoded) => {
                if (err) {
                    res.status(401).send({ message: "Unauthorized!"
                });
                }else{
                    next();
                }
            });
            }
        }
    catch(error){
        res.status(500).json({error})
    }
  
}

exports.authenticateUserRole = async (req, res, next) => {
    try{
        const token = req.headers["authorization"];
        jwt.verify(token, conf.secret, (err, decoded) => {
            if (decoded.userRole !== 'admin') {
                res.status(401).send({ message: "Need Admin Role!"
            });
            }else{
                next();
            }
        });
    }
    catch(error){
        res.status(500).send({error})
    }
}
