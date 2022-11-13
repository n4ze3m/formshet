import {
	ActionIcon,
	CopyButton,
	Switch,
	TextInput,
	Tooltip,
} from "@mantine/core";
import { ClipboardCheck, Clipboard } from "tabler-icons-react";

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

		case "copy":
			return (
				<TextInput
					key={id}
					value={value as string}
					readOnly={true}
					label={label}
					mb="md"
					rightSection={
						<CopyButton key={id} value={value as string} timeout={2000}>
							{({ copied, copy }) => {
								return (
									<Tooltip
										label={copied ? "Copied" : "Copy"}
										withArrow={true}
										position="right"
									>
										<ActionIcon color={copied ? "teal" : "gray"} onClick={copy}>
											{copied ? (
												<ClipboardCheck fontSize={16} />
											) : (
												<Clipboard fontSize={16} />
											)}
										</ActionIcon>
									</Tooltip>
								);
							}}
						</CopyButton>
					}
				/>
			);
		default:
			return <div>Unknown type</div>;
	}
};
