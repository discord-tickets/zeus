import {
	Client,
	EmbedBuilder,
	Events,
	GatewayIntentBits,
	MessageFlags,
	type InteractionReplyOptions,
} from 'discord.js';
import log from './logger';
import commands from './commands';
import ShortUniqueId from 'short-unique-id';
import {
	searchLogs, tailLogs,
} from './docker';

export const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
	],
});

client.once(Events.ClientReady, async client => {
	log.success(`Connected to Discord as ${client.user.tag}`);

	if (process.env.NODE_ENV === 'production') {
		try {
			log.info('Registering commands...');
			await client.application.commands.set(commands.map(cmd => cmd.toJSON()));
			log.success('Registered commands');
		} catch (error) {
			log.warn('Failed to register commands');
			log.error(error);
		}
	} else {
		log.warn('Skipping command registration in development mode');
	}
});

client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isChatInputCommand() && interaction.commandName === 'logs') {
		try {
			await interaction.deferReply({ flags: MessageFlags.Ephemeral });
			const subcommand = interaction.options.getSubcommand();
			if (subcommand === 'tail') {
				const logs = await tailLogs(interaction.options.getInteger('lines') ?? 10);
				await interaction.editReply({
					embeds: [
						new EmbedBuilder()
							.setColor('Gold')
							.setTitle('Logs')
							.setDescription(`\`\`\`ansi\n${logs}\n\`\`\``),
					],
				});
			} else if (subcommand === 'search') {
				const uid = new ShortUniqueId();
				const errorId = interaction.options.getString('error');
				if (!errorId) throw new Error('No error ID provided');
				const timestamp = uid.parseStamp(errorId).getTime();
				const since = new Date(timestamp - 15e3).toISOString();
				const until = new Date(timestamp + 15e3).toISOString();
				const lines = await searchLogs(errorId, since, until);
				if (lines.length === 0) {
					await interaction.editReply({
						embeds: [
							new EmbedBuilder()
								.setColor('Red')
								.setTitle('No logs found'),
						],
					});
				} else {
					await interaction.editReply({
						embeds: [
							new EmbedBuilder()
								.setColor('Gold')
								.setTitle('Logs')
								.setDescription(`\`\`\`ansi\n${lines.join('\n')}\n\`\`\``),
						],
					});
				}
			}


		} catch (error) {
			log.error(error);
			const payload: InteractionReplyOptions = {
				content: 'Sorry, something went wrong.',
				flags: MessageFlags.Ephemeral,
			};
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp(payload);
			} else {
				await interaction.reply(payload);
			}
		}
	}
});