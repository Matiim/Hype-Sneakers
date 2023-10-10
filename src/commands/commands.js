const { Command } = require('commander')
const dotenv = require('dotenv')
const config= require('../config/config')

const program = new Command()

program
  .option('--mode <mode>', 'Modo de trabajo', 'local')

program.parse()
const options = program.opts()

dotenv.config({
  path: `.env.${options.mode}`
})

const settings = config()

module.exports = settings