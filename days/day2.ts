const sample_input = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

export const part1 = (input = sample_input) => {
	const requirements = {
		red: 12,
		green: 13,
		blue: 14,
	};

	const lines = input.split('\n');
	const games = lines.map((game, count) => {
		const sets = parse_sets_from_game(game);
		//console.log({ sets });
		const is_not_possible = sets.some((set) => {
			const pulls = parse_pulls_from_set(set);
			const map = pulls.reduce(parse_color_map_from_pull, new Map());
			return check_map_against_requirements(map, requirements);
		});
		return !is_not_possible;
	});
	const final = games.reduce(
		(total, result, index) => total + (result ? index + 1 : 0),
		0,
	);
	//console.log({ final });

	return final;
};

function check_map_against_requirements(
	map: Map<string, number>,
	requirements: Record<string, number>,
) {
	return Object.entries(requirements).some(([key, value]) => {
		const count = map.get(key);
		const isUndefined = count === undefined;
		if (isUndefined) return false;
		const isTooBig = count > value;
		return isTooBig;
	});
}

function parse_set(input: string) {
	const pullss = parse_pulls_from_set(input);
	return pullss.reduce(parse_color_map_from_pull, new Map());
}

const parse_color_map_from_pull = (map: Map<string, number>, pull: string) => {
	const [count, color] = pull.split(' ');
	return map.set(color, parseInt(count));
};

export const part2 = (input = sample_input) => {
	const lines = parse_lines_from_string(input);
	const games = lines.map((line, count) => {
		const sets = parse_sets_from_game(line);
		const map_of_sets = sets.reduce(add_set_to_map, new Map());
		return get_power_from_map_of_sets(map_of_sets);
	});

	return games.reduce((sum, game) => sum + game);
};

const get_power_from_map_of_sets = (map: Map<string, number>) =>
	[...map.values()].reduce((power, count) => power * count, 1);

const parse_lines_from_string = (string: string) => string.split('\n');
const parse_sets_from_game = (game: string) => game.split(': ')[1]!.split('; ');
const parse_pulls_from_set = (set: string) => set.split(', ');

function add_set_to_map(
	map: Map<string, number>,
	set: string,
): Map<string, number> {
	const pulls = set.split(', ');
	return pulls.reduce(add_pull_to_map, map);
}

function add_pull_to_map(
	map: Map<string, number>,
	pull: string,
): Map<string, number> {
	const [count, color] = pull.split(' ');
	const current_count = map.get(color) || 0;
	return map.set(color, Math.max(parseInt(count), current_count));
}
