import {
	Button,
	Card,
	Divider,
	Group,
	Paper,
	PasswordInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
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

	const pwdForm = useForm({
		initialValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

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
							<div key={item.id.toString()}>
								<SettingType
									id={item.id.toString()}
									label={item.label}
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
							</div>
						))}
						<Group position="right">
							<Button color="teal" leftIcon={<File />}>
								Save
							</Button>
						</Group>
					</Paper>
					<Divider my="md" variant="dashed" label="Update Password" />
					<Paper p={"md"}>
						<form>
							<PasswordInput
								label="Current Password"
								required={true}
								{...pwdForm.getInputProps("currentPassword")}
							/>
							<PasswordInput
								label="New Password"
								required={true}
								{...pwdForm.getInputProps("newPassword")}
							/>
							<PasswordInput
								label="Confirm Password"
								required={true}
								{...pwdForm.getInputProps("confirmPassword")}
							/>
							<Group mt="md" position="right">
								<Button color="teal" leftIcon={<File />}>
									Save
								</Button>
							</Group>
						</form>
					</Paper>
					{settingsData.isAdmin && (
						<>
							<Divider my="md" variant="dashed" label="Admin" />
							<Paper p={"md"}>
								{adminBlock.map((item) => (
									<div key={item.id.toString()}>
										<SettingType
											id={item.id.toString()}
											label={item.label}
											type={item.type}
											value={item.value}
											onChange={(value) => {
												// update the list
												const index = adminBlock.findIndex(
													(i) => i.id === item.id,
												);
												const updateAdminBlock = [...adminBlock];
												updateAdminBlock[index].value = value;
												setProfileChange({
													[item.id]: value,
												});
											}}
										/>
									</div>
								))}
								<Group mt="md" position="right">
									<Button color="teal" leftIcon={<File />}>
										Save
									</Button>
								</Group>
							</Paper>
						</>
					)}
				</div>
			)}
		</div>
	);
};
