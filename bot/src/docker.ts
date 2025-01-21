// const unix = '/var/run/docker.sock';

export async function tailLogs(lines: number): Promise<string> {
	const url = `http://proxy/containers/${process.env.CONTAINER_NAME as string}/logs?stderr=true&stdout=true&tail=${lines}`;
	// const res = await fetch(url, { unix });
	const res = await fetch(url);
	return await res.json();
};

export async function searchLogs(string: string, since: string, until: string): Promise<string[]> {
	const url = `http://proxy/containers/${process.env.CONTAINER_NAME as string}/logs?stderr=true&stdout=true&since=${since}&until=${until}`;
	// const res = await fetch(url, { unix });
	const res = await fetch(url);
	const logs = await res.json() as string;
	const lines = logs.split('\n');
	const index = lines.findIndex(line => line.includes(string));
	if (index === -1) return [];
	lines[index] = lines[index].replace(string, `[1;2;2m[1m${string}[0m`);
	return lines.slice(Math.max(0, index - 5), Math.min(lines.length, index + 10));
};