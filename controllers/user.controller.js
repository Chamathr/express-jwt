const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const conf = require('../config/auth.config')

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { config } = require('nodemon');

exports.allUsers = async (req, res, next) => {
  try{
    const allUsers = await prisma.users.findMany();
    res.send(allUsers)
  }
  catch(error){
    res.status(500).send({error})
  }
}

exports.signinUsers = async (req, res, next) => {
  try{
    const user = await prisma.users.findUnique({
      where: {
        name: req.body.name
      }
    })
    if(!user){
      res.send("Invalid user")
    }else{
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if(!passwordIsValid){
        res.send("Invalid password")
      }else{
        const role = await prisma.users.findUnique({
          where: {
            name: req.body.name
          },
          select: {
            role: true
          }
        })
        const token = jwt.sign({ name: user.name, userRole: role.role }, conf.secret, {
          expiresIn: conf.time 
        });
        res.send(`succesfully logged in... ${token}`)
      }
    }

  }
  catch(error){
    res.status(500).send({error})
  }
}

exports.addUsers = async (req, res, next) => {
    try{
      const userExists = await prisma.users.findUnique({
        where: {
          name: req.body.name
        }
      })
      if(userExists){
        return res.send({message: "user already exits"})
      }else{
        try{
          await prisma.users.create({
            data: {
              name: req.body.name,
              password: bcrypt.hashSync(req.body.password, 8),
              role: req.body.role
            }
          })
          res.send('successfully created')
        }
        catch(error){
          res.status(500).send({ error });
        }
      }
    }
    catch(error){
      res.status(401).send({error})
    }
}

exports.updateUsers = async (req, res, next) => {
  try{
    await prisma.users.update(
      {
        where: {name: req.params.name},
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

exports.deleteUsers = async (req, res, next) => {
  try{
    await prisma.users.delete(
      {
        where: {name: req.params.name}
      }
    )
    res.send("successfully deleted")
  }
  catch(error){
    res.status(500).send({error})
  }

}
