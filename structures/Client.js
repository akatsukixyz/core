'use strict';
const discord = require('discord.js'),
  EventHandler = require('./EventHandler'),
  CommandHandler = require('./CommandHandler');
module.exports = class Client extends discord.Client {
  /**
   * Constructor
   * @param {Object} options 
   * @param {discord.ClientOptions} clientOptions 
   */
  constructor(options = {}, clientOptions = {}) { 
    if(!options.token) throw new Error(`No token specified.`);
    super(clientOptions);
    if(!options.owner) console.log(`No owner set. Owner-only settings will not take effect.`);
    if(!isNaN(options.token) || options.owner.length < 16 || options.owner.length > 18) {
      console.log(`Invalid owner ID provided.`);
      options.owner = null;
    };
    this.commands = new discord.Collection(); 
    this.commandsDir = options.commandsDir || './commands';
    this.eventsDir = options.eventsDir || './events';
    this.eventHandler = new EventHandler(this);
    this.eventHandler.load();
    this.commandHandler = new CommandHandler(this);
    this.commandHandler.load();
    this._token = options.token;
    this.prefix = options.prefix || '!';
    this.owner = String(options.owner) || null;
    this.on('error', console.log);
  }; 
  async start() { await this.login(this._token); };
};