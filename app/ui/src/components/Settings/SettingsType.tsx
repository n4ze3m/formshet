import { Switch, TextInput } from "@mantine/core";

type IProps = {
	id: string;
	label: string;
	type: string;
	value: string | boolean | number;
	onChange: (value?: any) => void;
};

export const SettingType = ({ id, type, value, onChange, label }: IProps) => {
	switch (type) {
		case "input":
			return (
				<TextInput
					key={id}
					label={label}
					mb="md"
					value={value as string}
					placeholder="Enter Text"
					style={{
						width: "100%",
					}}
					onChange={(e) => onChange(e.target.value)}
				/>
			);
		case "switch":
			return (
				<Switch
					key={id}
					labelPosition="right"
					label={label}
					mb="md"
					checked={value as boolean}
					onChange={(e) => onChange(e.currentTarget.checked)}
				/>
			);

		default:
			return <div>Unknown type</div>;
	}
};
