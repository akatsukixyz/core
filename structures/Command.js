const { Permissions } = require('discord.js');
module.exports = class Command {
  constructor(info = {}){ 
    Object.assign(this, info);
    if(typeof this.aliases === 'undefined') this.aliases = [];
    if(typeof this.senderPerms === 'undefined') this.senderPerms = [];
    if(typeof this.clientPerms === 'undefined') this.clientPerms = [];
    if(typeof this.ownerOnly === 'undefined') this.ownerOnly = false;
    if (!this.name) throw new Error(`A command is missing a name:\n${__filename}`);
		if (!this.description) throw new Error(`A description must be provided for the command: ${this.name}`);
		if (!this.usage) throw new Error(`Usage information must be provided for the command: ${this.name}`);
		if (this.aliases && !Array.isArray(this.aliases))
			throw new TypeError(`Aliases for Command "${this.name}" must be an array of alias strings`);

		if (this.senderPerms && !Array.isArray(this.senderPerms))
			throw new TypeError(`\`senderPerms\` for Command "${this.name}" must be an array`);

		if (this.clientPerms && !Array.isArray(this.clientPerms))
			throw new TypeError(`\`clientPerms\` for Command "${this.name}" must be an array`);

		if (this.senderPerms && this.senderPerms.length)
			this._validatePermissions('senderPerms', this.senderPerms);

		if (this.clientPerms && this.clientPerms.length)
			this._validatePermissions('clientPerms', this.clientPerms);

  };
  async execute(message, args) {};
  get disabled() { return this._disabled; };
  enable() { this._disabled = false; };
  disable() { this._disabled = true; };
  _validatePermissions(field, perms) {
		let errString = (i, err) =>
			`Command "${this.name}" permission "${perms[i]}" in ${field}[${i}] is not a valid permission.\n\n${err}`;

		for (const [index, perm] of perms.entries())
			try { Permissions.resolve(perm); }
			catch (err) { throw new TypeError(errString(index, err)); };
	};
};