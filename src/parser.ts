import { Info, parse } from "csv-parse";
import fs from "fs";
import _ from "lodash";

const universalConfig = {
	delimiter: "\t",
	fromLine: 2,
};

function getFirstLine(text: string) {
	// text.split("\n")[0] method is too inefficient
	const index = text.indexOf("\n");
	return index === -1 ? text : text.substring(0, index);
}

export interface ParsedOutput {
	records: Record<string, string>[];
	info: Info;
}

export async function parseTsv(
	sourceFileName: string,
	parsedFileName?: string
): Promise<ParsedOutput> {
	return new Promise((resolve, reject) => {
		const text = fs.readFileSync(sourceFileName, "utf8");
		parse(text, universalConfig, (err, records, info) => {
			if (err) reject(err);

			const objectKeys = getFirstLine(text).split("\t");
			records = records.map((record: string[]) =>
				_.zipObject(objectKeys, record)
			);
			if (parsedFileName)
				fs.writeFileSync(parsedFileName, JSON.stringify(records, null, "\t"));
			resolve({ records, info });
		});
	});
}
