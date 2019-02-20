# Akatsuki's Core

Hello, there! This module is designed to jumpstart your Discord.js bot. The easy-to-use command and event handlers provide the most meaningful experience when creating your bot. All you need to supply is your bot token, prefix, event/command directories, and you're all set!

# Installation
Using npm:
```
npm install akatsuki-core
npm install akatsukixyz/core
```
Using yarn:
```
yarn add akatsuki-core
yarn add akatsukixyz/core
```

## Examples
Index file:
```js
const { Client } = require('akatsuki-core');

require('dotenv').config();

const client = new Client({ token: process.env.TOKEN, prefix:  '?', owner: '1234567890123456' });
client.on('ready', () => console.log(`Bot logged in as ${client.user.tag}`));

client.start();
```
Command File:
```js
const { Command } = require('akatsuki-core');

module.exports = class Test extends Command {
	constructor(client) {
		super({
			name: 'Help',
			description: 'Help command',
			usage: `\`${client.prefix}help\``,
			aliases: ['`helpme`'],
			category: 'misc',
			senderPerms: ['SEND_MESSAGES'],
			clientPerms: ['SEND_MESSAGES'],
			ownerOnly: false
		});
		this.client = client;
	};
	async execute(message, args) {
		return message.channel.send('Test!');
	};
};
```
Event File:
```js
const { Event } = require('akatsuki-core');
module.exports = class ReadyEvent extends Event {
	constructor() { 
		super({ name: 'ready' }); 
	};
	async execute(client) {
		console.log(`Logged in as ${client.user.tag}`);
	};
};
```
Message Event:
```js
const { Event } = require('akatsuki-core');
module.exports = class MessageEvent extends Event {
	constructor() { 
		super({ name: 'message' }); 
	};
	async execute(client, message) {
		if (message.author.bot) return;
		if(!message.content.trim().toLowerCase().startsWith(client.prefix)) return;
		const args = message.content.trim().slice(client.prefix.length).split(/\s+/g),
			command = args.shift().toLowerCase(),
			cmd = client.commands.get(command);
		
		if(!cmd) return;

		if(cmd.ownerOnly && message.author.id !== client.owner) return;

		if(!cmd.clientPerms.some(p => message.guild.me.hasPermission(p))) return message.channel.send(`Error: I need the \`${cmd.clientPerms.join('`, `')}\` permissions to use this command`);
		if(!cmd.senderPerms.some(p => message.member.hasPermission(p))) return message.channel.send(`Error: You require the \`${cmd.senderPerms.join('`, `')}\` permissions to use this command`);
		
		try { return cmd.execute(message, args); }
		catch(e) { await message.channel.send('Something went wrong....'); return console.log(e); };
	};
};
```