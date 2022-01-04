import _ from "lodash";
import { calcPercentage } from "./utils";

export function findMostAndLeastFrequentValues(
	records: Record<string, string>[]
) {
	const allKeys = _.uniq(_.flatMap(records, record => Object.keys(record)));
	const allValues: {
		[key: string]: {
			[value: string]: number;
		};
	} = {};

	for (const key of allKeys) {
		allValues[key] = {};
		for (const obj of records) {
			const value = obj[key];
			if (!allValues[key][value]) allValues[key][value] = 0;
			allValues[key][value]++;
		}
	}

	const mostFrequentValues: {
		[prop: string]: {
			[value: string]: {
				count: number;
				percentage: string;
			};
		};
	} = {};
	const leastFrequentValues: {
		[prop: string]: {
			[value: string]: {
				count: number;
				percentage: string;
			};
		};
	} = {};
	const allIdenticalValues: {
		[prop: string]: string;
	} = {};
	for (const [key, allValuesInThisKey] of Object.entries(allValues)) {
		if (Object.entries(allValuesInThisKey).length === 1) {
			allIdenticalValues[key] = Object.entries(allValuesInThisKey)[0][0];
			continue;
		}

		mostFrequentValues[key] = {};
		leastFrequentValues[key] = {};

		Object.entries(allValuesInThisKey)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 3)
			.forEach(
				([value, count]) =>
					(mostFrequentValues[key][value] = {
						count,
						percentage: calcPercentage(count, records.length),
					})
			);
		Object.entries(allValuesInThisKey)
			.sort((a, b) => a[1] - b[1])
			.slice(0, 3)
			.forEach(
				([value, count]) =>
					(leastFrequentValues[key][value] = {
						count,
						percentage: calcPercentage(count, records.length),
					})
			);
	}

	return { mostFrequentValues, leastFrequentValues, allIdenticalValues };
}
