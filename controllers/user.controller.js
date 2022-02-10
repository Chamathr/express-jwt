const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const conf = require('../config/auth.config')

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { config } = require('nodemon');

exports.allUsers = async (req, res, next) => {
  try{
    const allUsers = await prisma.test_1.findMany();
    res.send(allUsers)
  }
  catch(error){
    res.status(500).json({error})
  }
}

exports.signinUsers = async (req, res, next) => {
  try{
    const user = await prisma.test_1.findUnique({
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
        const token = jwt.sign({ name: user.name }, conf.secret, {
          expiresIn: conf.time 
        });
        console.log(token);
        res.send(`succesfully logged in... ${token}`)
      }
    }

  }
  catch(error){
    console.log(error);
    res.status(500).json({error})
  }
}

exports.addUsers = async (req, res, next) => {
  try{
    await prisma.test_1.create({
      data: {
        name: req.body.name,
        password: bcrypt.hashSync(req.body.password, 8)
      }
    })
    res.send('successfully created')
  }
  catch(error){
    res.status(500).json({ error });
  }
}

exports.updateUsers = async (req, res, next) => {
  try{
    await prisma.test_1.update(
      {
        where: {id: parseInt(req.params.id)},
        data: {
          name: req.body.name
        }
      }
    )
    res.send("successfully updated")
  }
  catch(error){
    res.status(500).json({error})
  }
}

exports.deleteUsers = async (req, res, next) => {
  try{
    await prisma.test_1.delete(
      {
        where: {id: parseInt(req.params.id)}
      }
    )
    res.send("successfully deleted")
  }
  catch(error){
    res.status(500).json({error})
  }

}
