export function calcPercentage(value: number, total: number) {
	return `${Math.round((value / total) * 10000) / 100}%`;
}
