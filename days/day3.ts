const sample_input = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

export function part1(input = sample_input) {
	return getLines(input)
		.flatMap(processLine)
		.reduce(
			(sum, [part_number, is_valid_part_number]) =>
				is_valid_part_number ? sum + part_number : sum,
			0,
		);
}

const processLine = (line: string, index: number, lines: string[]) =>
	[...line.matchAll(/\d+/g)].map(
		checkIsValidPartNumber({
			line,
			prev_line: index > 0 ? lines[index - 1] : undefined,
			next_line: index + 1 < lines.length ? lines[index + 1] : undefined,
		}),
	);

const checkIsValidPartNumber =
	({
		line,
		prev_line,
		next_line,
	}: {
		line: string;
		prev_line?: string;
		next_line?: string;
	}) =>
	({
		0: part_number,
		index,
	}: RegExpMatchArray): [
		part_number: number,
		is_valid_part_number: boolean,
	] => {
		if (index === undefined) throw 'HUH?';
		const start_index = Math.max(0, index - 1);
		const end_index = Math.min(index + part_number.length, line.length - 1);

		const chars_above_number = prev_line?.slice(start_index, end_index + 1);
		const chars_below_number = next_line?.slice(start_index, end_index + 1);
		const char_left_number = line[start_index];
		const char_right_number = line[end_index];

		const all_touching_chars =
			(chars_above_number ?? '') +
			(chars_below_number ?? '') +
			char_left_number +
			char_right_number;

		const is_valid_part_number =
			all_touching_chars.match(/[^\w\d\s\.]/)?.length != undefined;

		return [parseInt(part_number), is_valid_part_number];
	};

const getLines = (input: string) => input.split('\n');
