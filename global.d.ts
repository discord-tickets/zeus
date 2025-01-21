declare global {
	interface FetchUnixOptions extends RequestInit {
		unix?: string;
	}

	function fetch(input: RequestInfo, init?: FetchUnixOptions): Promise<Response>;
}

export { };