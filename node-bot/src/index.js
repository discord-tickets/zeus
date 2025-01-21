import log from './logger.js';
import { client } from './discord.js';

function exit(signal) {
	log.notice(`Received ${signal}`);
	client.destroy();
	process.exit(0);
}

process.on('SIGTERM', () => exit('SIGTERM'));

process.on('SIGINT', () => exit('SIGINT'));

process.on('unhandledRejection', error => {
	if (error instanceof Error) log.warn(`Uncaught ${error.name}`);
	log.error(error);
});

client.login(process.env.DISCORD_TOKEN);