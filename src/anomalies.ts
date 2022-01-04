import _ from "lodash";
import { calcPercentage } from "./utils";

export interface PropRequirements {
	[key: string]: {
		required?: boolean;
		shouldBeUnique?: boolean;

		shouldBeInt?: boolean;
		shouldBeFloat?: boolean;
		shouldBeOfLength?: number;
	};
}

export interface Anomalies {
	requiredProps: {
		[prop: string]: {
			totalObjects: number;
			percentage?: string;
		};
	};
	unnecessaryProps: {
		[prop: string]: {
			totalObjects: number;
			percentage?: string;
		};
	};
	incorrectPropTypes: {
		[prop: string]: {
			totalObjects: number;
			percentage?: string;
			shouldBe: string;
			got: string[];
		};
	};
	incorrectPropValues: {
		[prop: string]: {
			totalObjects: number;
			percentage?: string;
			shouldBe: string;
			got: string[];
		};
	};
}

export function findAnomalies(
	objects: Record<string, string>[],
	propRequirements: PropRequirements
) {
	const report: Anomalies = {
		requiredProps: {},
		unnecessaryProps: {},
		incorrectPropTypes: {},
		incorrectPropValues: {},
	};

	// for every property, check if it have all requirements
	for (const obj of objects) {
		for (const [key, value] of Object.entries(obj)) {
			// find appropriate requirement
			const requirement = propRequirements[key];
			if (!requirement) {
				if (!report.unnecessaryProps[key])
					report.unnecessaryProps[key] = {
						totalObjects: 0,
					};
				report.unnecessaryProps[key].totalObjects++;
				report.unnecessaryProps[key].percentage = calcPercentage(
					report.unnecessaryProps[key].totalObjects,
					objects.length
				);
				continue;
			}

			// check all requirements
			if (requirement.required && !value) {
				if (!report.requiredProps[key])
					report.requiredProps[key] = {
						totalObjects: 0,
					};
				report.requiredProps[key].totalObjects++;
				report.requiredProps[key].percentage = calcPercentage(
					report.requiredProps[key].totalObjects,
					objects.length
				);
			}
			if (
				requirement.shouldBeUnique &&
				objects.filter(o => o[key] === value).length > 1
			) {
				if (!report.incorrectPropValues[key])
					report.incorrectPropValues[key] = {
						totalObjects: 0,
						shouldBe: "unique",
						got: [],
					};
				report.incorrectPropValues[key].totalObjects++;
				report.incorrectPropValues[key].percentage = calcPercentage(
					report.incorrectPropValues[key].totalObjects,
					objects.length
				);
				report.incorrectPropValues[key].got.push(value);
			}
			if (requirement.shouldBeInt && !_.isNaN(value)) {
				if (!report.incorrectPropTypes[key])
					report.incorrectPropTypes[key] = {
						totalObjects: 0,
						shouldBe: "integer",
						got: [],
					};
				report.incorrectPropTypes[key].totalObjects++;
				report.incorrectPropTypes[key].percentage = calcPercentage(
					report.incorrectPropTypes[key].totalObjects,
					objects.length
				);
				report.incorrectPropTypes[key].got.push(value);
			}
			if (
				requirement.shouldBeFloat &&
				!_.isNaN(value) &&
				!_.isNaN(parseFloat(value))
			) {
				if (!report.incorrectPropTypes[key])
					report.incorrectPropTypes[key] = {
						totalObjects: 0,
						shouldBe: "float",
						got: [],
					};
				report.incorrectPropTypes[key].totalObjects++;
				report.incorrectPropTypes[key].percentage = calcPercentage(
					report.incorrectPropTypes[key].totalObjects,
					objects.length
				);
				report.incorrectPropTypes[key].got.push(value);
			}
			if (
				requirement.shouldBeOfLength &&
				value.length !== requirement.shouldBeOfLength
			) {
				if (!report.incorrectPropValues[key])
					report.incorrectPropValues[key] = {
						totalObjects: 0,
						shouldBe: `of length ${requirement.shouldBeOfLength}`,
						got: [],
					};
				report.incorrectPropValues[key].totalObjects++;
				report.incorrectPropValues[key].percentage = calcPercentage(
					report.incorrectPropValues[key].totalObjects,
					objects.length
				);
				report.incorrectPropValues[key].got.push(value);
			}
		}
	}

	return report;
}
