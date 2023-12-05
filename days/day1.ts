const sample_input = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;

export const part1 = (input = sample_input) =>
	input.split('\n').reduce((total, str) => {
		const nums = str.match(/[0-9]/g);
		if (!nums?.length) throw 'No nums in a line';
		return total + parseInt(nums.at(0)! + nums.at(-1));
	}, 0);

export const part2 = (input = sample_input) =>
	input.split('\n').reduce((total, str) => {
		const nums = str.match(
			/(\d|one|two|three|four|five|six|seven|eight|nine)/g,
		);
		if (!nums?.length) throw 'No nums in a line';
		const num1 = parseNumber(nums.at(0)!);
		const num2 = parseNumber(nums.at(-1)!);
		return total + parseInt(`${num1}${num2}`);
	}, 0);

function parseNumber(str: string) {
	const result = parseInt(str);
	if (!isNaN(result)) return result;

	switch (str) {
		case 'one':
			return 1;
		case 'two':
			return 2;
		case 'three':
			return 3;
		case 'four':
			return 4;
		case 'five':
			return 5;
		case 'six':
			return 6;
		case 'seven':
			return 7;
		case 'eight':
			return 8;
		case 'nine':
			return 9;
		default:
			throw new Error('mistake made');
	}
}
