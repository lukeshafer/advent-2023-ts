const sample_input = ``;

export function part3(input = sample_input) {
	const lines = getLines(input);

	lines.forEach(processLine);

	for (const line of lines) {
	}
}

const processLine = (line: string, index: number, lines: string[]) => {
	const prev_line = index > 0 ? lines[index - 1] : undefined;
	const next_line = index + 1 < lines.length ? lines[index + 1] : undefined;

	line.split('').forEach((char, index, line) => {

	});

	for (const char of line.split('')) {
	}
};

const getLines = (input: string) => input.split('\n');
