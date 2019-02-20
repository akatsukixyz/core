'use strict';
const fs = require('fs'),
  path = require('path'),
  Client = require('./Client');
module.exports = class CommandHandler {
  /**
   * Designates the client to handle events
   * @param {Client} client 
   */
  constructor(client) { this.client = client; };
  load() {
    const files = fs.readdirSync(path.resolve(this.client.commandsDir)).filter(f => f.endsWith('js'));
    if(files.length === 0) console.log(`Warning: No commands loaded.`);
      for (const file of files) {
        const command = new (require(path.resolve(`${this.client.commandsDir}/${file}`)))(this.client);
        this.client.commands.set(command.name.toLowerCase(), command);
        for (const alias of command.aliases) this.client.commands.set(alias.toLowerCase(), command);
      };
    };
};