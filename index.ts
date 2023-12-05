import * as day1 from './days/day1';
import day1_input from './inputs/day1';

import * as day2 from './days/day2';
import day2_input from './inputs/day2';

let day_count = 0;

test(day1, day1_input)
test(day2, day2_input)


function test(
	day: {
		part1: (input: string | undefined) => any;
		part2?: (input: string | undefined) => any;
	},
	input?: string,
) {
	input ||= undefined

	console.log(`Day ${++day_count}:`);
	console.log(`  part 1:`, day.part1(input));
	if (day.part2) console.log(`  part 2:`, day.part2(input));
}



