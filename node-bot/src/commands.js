import { SlashCommandBuilder } from 'discord.js';

export default [
	new SlashCommandBuilder()
		.setName('logs')
		.setDescription('Search the logs of the public instance')
		.setDefaultMemberPermissions(0)
		.addSubcommand(subcommand =>
			subcommand
				.setName('search')
				.setDescription('Search the logs.')
				.addStringOption(option =>
					option
						.setName('error')
						.setDescription('The error ID to search for.')
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('tail')
				.setDescription('Print the last n lines.')
				.addIntegerOption(option =>
					option
						.setName('lines')
						.setDescription('The number of lines to print. (default: 10)')
						.setMinValue(1)
						.setMaxValue(100),
				),
		),
];