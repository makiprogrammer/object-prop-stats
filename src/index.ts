import fs from "fs";
import { parseTsv } from "./parser";
import { findAnomalies } from "./anomalies";
import { findMostAndLeastFrequentValues } from "./stats";

parseTsv("data/programs.tsv", "parsed/programs.json").then(
	({ records, info }) => {
		console.log(info);

		const anomalies = findAnomalies(records, {
			faculty_code: { required: true },
			name: { required: true },
			code: { required: true },
			language: { required: true, shouldBeOfLength: 2 },
			degree: { required: true },
			duration: { required: true, shouldBeInt: true },
			// length_years: {required: true, shouldBeInt: true, aliases: ["duration", "length"]}, // TODO
		});
		// console.log(findAnomalies(records, propRequirements));
		fs.writeFileSync("anomalies.json", JSON.stringify(anomalies, null, "\t"));

		const statistics = findMostAndLeastFrequentValues(records);
		// console.log(statistics);
		fs.writeFileSync("statistics.json", JSON.stringify(statistics, null, "\t"));
	}
);
