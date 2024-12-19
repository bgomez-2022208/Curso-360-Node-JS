const router = require ("express").Router()

const {faker} = require("@faker-js/faker")

const usuarios = require("../usuarios/usuarios.model")
const {where} = require("sequelize");

