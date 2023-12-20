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

export function part2(input = sample_input) {
	const lines = getLines(input)
	const gear_map = lines.reduce(reduceLinesToGearMap, new Map())

	const valid_gears = Array.from(gear_map.values())
		.filter((part_numbers) => part_numbers.size === 2)

	const ratios = valid_gears
		.map((part_numbers) =>
			Array.from(part_numbers)
				.reduce((ratio, number) => Number(number) * ratio, 1))

	const ratio_sum = ratios.reduce((sum, ratio) => sum + ratio)

	//console.log(ratio_sum)
	return ratio_sum;
}

type NumsWithGears = {
	part_number: string;
	gears: Array<Gear>
}
type GearMap = Map<string, Set<string>>;
function reduceLinesToGearMap(gear_map: GearMap, line: string, index: number, lines: Array<string>): GearMap {
	const nums = [...line.matchAll(/\d+/g)]
	const prev_line_index = index > 0 ? index - 1 : undefined
	const prev_line = prev_line_index !== undefined ? lines[prev_line_index] : undefined

	const next_line_index = index + 1 < lines.length ? index + 1 : undefined
	const next_line = next_line_index !== undefined ? lines[next_line_index] : undefined

	const numsWithGears = nums.map(getGearsTouchingPartNumbers({
		line,
		line_index: index,
		prev_line,
		next_line,
		prev_line_index,
		next_line_index,
	}))

	return numsWithGears.reduce(reduceNumsWithGearsToGearMap, gear_map)
}

const reduceNumsWithGearsToGearMap = (gear_map: GearMap, { part_number, gears }: NumsWithGears): GearMap =>
	gears.reduce((gear_map, gear) => {
		const key = getGearKey(gear)
		const part_set = gear_map.get(key) || new Set()
		return gear_map.set(key, part_set.add(part_number))
	}, gear_map)

const getGearKey = (gear: Gear) => JSON.stringify([gear.row, gear.col])

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

type Gear = {
	col: number;
	row: number;
}

const getGearsTouchingPartNumbers =
	({
		line,
		line_index,
		prev_line,
		next_line,
		prev_line_index,
		next_line_index,
	}: {
		line: string;
		line_index: number;
		prev_line?: string;
		next_line?: string;
		prev_line_index?: number;
		next_line_index?: number;
	}) =>
		({
			0: part_number,
			index,
		}: RegExpMatchArray): {
			part_number: string,
			gears: Array<Gear>
		} => {
			if (index === undefined) throw 'HUH?';
			const start_index = Math.max(0, index - 1);
			const end_index = Math.min(index + part_number.length, line.length - 1);

			const chars_above_number = prev_line?.slice(start_index, end_index + 1);
			const chars_below_number = next_line?.slice(start_index, end_index + 1);

			const gears = new Array<Gear>().concat(
				line[start_index] === '*' ? [{ col: start_index, row: line_index }] : [],
				line[end_index] === '*' ? [{ col: end_index, row: line_index }] : [],
				chars_above_number ? getGearData(chars_above_number, start_index, prev_line_index!) : [],
				chars_below_number ? getGearData(chars_below_number, start_index, next_line_index!) : [],
			);

			return { part_number, gears };
		};

function getGearData(chars: string, start_index: number, line_index: number): Array<Gear> {
	const gears = [...chars.matchAll(/\*/g)];
	return gears.map(({ index }) => ({ col: (index || 0) + start_index, row: line_index }));
}

const getLines = (input: string) => input.split('\n');
