'use strict';
const fs = require('fs');
const path = require('path');
module.exports = class CommandHandler {
  /**
   * Designates the client to handle events
   * @param {Client} client 
   */
  constructor(client) { this.client = client; };
  load() {
    try { var files = fs.readdirSync(path.resolve(this.client.eventsDir)).filter(f => f.endsWith('.js')); }
    catch(e) { throw new Error(e); };
    if(files.length === 0) console.log(`Warning: No events loaded.`);
    for (const file of files) {
      const event = new (require(path.resolve(`${this.client.eventsDir}/${file}`)));
      this.client.on(event.name, (...params) => event.execute(this.client, ...params));
    };
  };
};