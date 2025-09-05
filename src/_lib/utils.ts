export const convertTo = {
	number: (v: unknown) => {
		const value = Number(v);
		return isNaN(value) ? null : value;
	},
};
