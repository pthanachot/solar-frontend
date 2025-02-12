export type SelectOption = {
	id: number;
	name: string;
};

export interface IGaugeValue {
	value: number;
	time: number | null;
}
