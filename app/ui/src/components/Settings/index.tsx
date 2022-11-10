import { Button, Card, Divider, Group, Paper } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { File } from "tabler-icons-react";
import api from "../../service/api";
import { SettingType } from "./SettingsType";

type ISettingsProps = {
	id: number;
	value: string | boolean | number;
	type: string;
	label: string;
};

export const SettingsBody = () => {
	const [profileBlock, setProfileBlock] = React.useState<ISettingsProps[]>([]);
	const [profileChange, setProfileChange] = React.useState({});
	const [adminBlock, setAdminBlock] = React.useState<ISettingsProps[]>([]);
	const fetchData = async () => {
		const response = await api.get("/user/settings");
		return response.data;
	};

	const { data: settingsData, status: settingsStatus } = useQuery(
		["fetchSettingsData"],
		fetchData,
		{
			onSuccess: (data) => {
				setProfileBlock(data["profileBlock"]);
				setAdminBlock(data["adminBlock"]);
			},
		},
	);

	return (
		<div>
			{settingsStatus === "loading" && <div>Loading...</div>}
			{settingsStatus === "error" && <div>Error</div>}
			{settingsStatus === "success" && (
				<div>
					<Divider my="md" variant="dashed" label="Profile" />
					<Paper p={"md"}>
						{profileBlock.map((item) => (
							<Card mb="md" radius="md" key={item.id.toString()}>
								<SettingType
									id={item.id.toString()}
									type={item.type}
									value={item.value}
									onChange={(value) => {
										// update the list
										const index = profileBlock.findIndex(
											(i) => i.id === item.id,
										);
										const updateProfileBlock = [...profileBlock];
										updateProfileBlock[index].value = value;
										setProfileChange({
											[item.id]: value,
										});

										setProfileBlock(updateProfileBlock);
									}}
								/>
							</Card>
						))}
						<Group position="right">
							<Button color="teal" leftIcon={<File />}>
								Save
							</Button>
						</Group>
					</Paper>
				</div>
			)}
		</div>
	);
};
