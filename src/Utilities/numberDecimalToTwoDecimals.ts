export const numberDecimalToTwoDecimals = (value: number) => {
	return Math.round(value  * 100) / 100
}