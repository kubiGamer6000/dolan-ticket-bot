const Discord = require('discord.js');
const bot = new Discord.Client();
const moment = require('moment');

bot.on('ready', async () => {
	await bot.user.setActivity(`for new tickets.`, { type: 3 });
});

bot.on('message', async (msg) => {
	if (msg.channel.id == '709831988265091122') {
		msg.delete();
		if (msg.content.startsWith('-new')) {
			const ticketReason = msg.content.slice(5);
			ticketAuthor = msg.author;
			const channelName = `ticket-${msg.author.id}`.toLowerCase();
			try {
				if (msg.guild.channels.cache.find((c) => c.name.toLowerCase() === channelName)) {
					msg.author.send(
						'You have tried to create a new ticket while having a pending one! Please wait until current ticket is resolved.'
					);
				} else {
					const channel = await msg.guild.channels.create(channelName, {
						type: 'text',
						permissionOverwrites: [
							{
								id: msg.author.id,
								allow: [ 0x400 ]
							},
							{
								id: '709847496523776071',
								allow: [ 0x400 ]
							},
							{
								id: '709831488883130451',
								deny: [ 0x400 ]
							}
						]
					});
					channel.send(
						'Here you can have a private conversation with all staff members. Feel free to ask a question. Any staff will be able to close the ticket with `-close` command.'
					);
					if (msg.content.length > 5) channel.send(`Reason for creation of ticket: ${ticketReason}`);
					else channel.send('Reason for creation of ticket not specified.');
				}
			} catch (e) {
				console.log(e);
			}
		}
	}
	if (msg.content.startsWith('-close') && msg.channel.name.startsWith('ticket-')) {
		if (msg.member.roles.cache.find((r) => r.name === 'Staff')) {
			const msgHistory = await msg.channel.messages.fetch();
			let finalArray = [];
			const putInArray = async (data) => (finalArray = [ ...finalArray, data ]);
			const handleTime = (timestamp) =>
				moment(timestamp).format('DD/MM/YYYY - hh:mm:ss a').replace('pm', 'PM').replace('am', 'AM');

			for (const message of msgHistory.array().reverse())
				await putInArray(`${handleTime(message.timestamp)} ${message.author.username} : ${message.content}`);
			(await bot.users.fetch(msg.channel.name.slice(7))).send(
				'Ticket closed: \n' + '```' + finalArray.join('\n') + '```'
			);
			msg.channel.delete();
		} else {
			msg.channel.send('Sorry but only staff can close the ticket!');
		}
	}
});

bot.login(process.env.BOT_TOKEN);
