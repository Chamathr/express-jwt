const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const conf = require('../config/auth.config')

const jwt = require("jsonwebtoken");


exports.deleteMyProfile = async (req, res, next) => {
    try{
      const token = req.headers["authorization"];
      
      jwt.verify(token, conf.secret, async (err, decoded) => {
        if(err){
            res.status(401).send({message: "Unauthorized"})
        }else{
            try{
                await prisma.users.delete(
                    {
                      where: {name: decoded.name}
                    }
                  )
                res.send("successfully deleted") 
            }
            catch(error){
                res.status(401).send({error})
            }
        }
      });   
    }
    catch(error){
      res.status(500).send({error})
    }
  }

  exports.updateMyProfile = async (req, res, next) => {
    const token = req.headers["authorization"];
    jwt.verify(token, conf.secret, async (err, decoded) => {
        if(err){
            return res.status(401).send({message: "Unauthorized"})
        }else{
            try{
                await prisma.users.update(
                    {
                        where: {name: decoded.name},
                        data: {
                            name: req.body.name
                        }
                    }
                )
                res.send("successfully updated")
            }
            catch(error){
                res.status(500).send({error})
            }
        }
    })
  }

  exports.getMyProfile = async (req, res, next) => {
    const token = req.headers["authorization"];
    jwt.verify(token, conf.secret, async (err, decoded) => {
      if(err){
          return res.status(401).send({message: "Unauthorized"})
      }else{
          try{
              const details = await prisma.users.findUnique(
                  {
                      where: {name: decoded.name},
                      select: {
                        name: true,
                        role: true
                      }
                  }
              )
              res.send(details)
          }
          catch(error){
              res.status(500).send({error})
          }
      }
  })
  }