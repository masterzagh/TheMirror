require('dotenv').config();
const BOT_TOKEN = process.env.BOT_TOKEN;
const BOT_PREFIX = process.env.BOT_PREFIX||"-";

const Discord = require('discord.js');
const client = new Discord.Client();

let parser = require('./parser.js');

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	parser.prefix = BOT_PREFIX;
});

client.on('message', msg => {
	if(msg.author.id != client.user.id)
		parser.parse(msg.content, msg);
});

client.login(BOT_TOKEN);
