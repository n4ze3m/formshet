export function generateMarkdownTable(data: Record<string, string>): string {
	const table = Object.entries(data)
		.map(([key, value]) => `| ${key} | ${value} |`)
		.join("\n");
	return `| Field | Value |
| ---- | ----------- |
${table}
`;
}
