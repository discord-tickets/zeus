import Dockerode from 'dockerode';

export const docker = new Dockerode();

export async function tailLogs(lines) {
	const container = docker.getContainer(process.env.CONTAINER_NAME);
	const buffer = await container.logs({
		stderr: true,
		stdout: true,
		tail: lines,
	});
	return buffer.toString('utf-8');
};

export async function searchLogs(string, since, until) {
	const container = docker.getContainer(process.env.CONTAINER_NAME);
	const buffer = await container.logs({
		since,
		stderr: true,
		stdout: true,
		until,
	});
	const logs = buffer.toString('utf-8');
	const lines = logs.split('\n');
	const index = lines.findIndex(line => line.includes(string));
	if (index === -1) return [];
	lines[index] = lines[index].replace(string, `[1;2;2m[1m${string}[0m`);
	return lines.slice(Math.max(0, index - 5), Math.min(lines.length, index + 10));
};