import {
	Button,
	Card,
	Divider,
	Group,
	Paper,
	PasswordInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { File } from "tabler-icons-react";
import api from "../../service/api";
import { handleError } from "../../utils/error";
import { SettingType } from "./SettingsType";

type ISettingsProps = {
	id: number;
	value: string | boolean | number;
	type: string;
	label: string;
};

export const SettingsBody = () => {
	const client = useQueryClient();
	const [profileBlock, setProfileBlock] = React.useState<ISettingsProps[]>([]);
	const [profileChange, setProfileChange] = React.useState({});
	const [adminChange, setAdminChange] = React.useState({});
	const [adminBlock, setAdminBlock] = React.useState<ISettingsProps[]>([]);
	const fetchData = async () => {
		const response = await api.get("/user/settings");
		return response.data;
	};

	const pwdForm = useForm({
		initialValues: {
			currentPassword: "",
			newPassword: "",
			confPassword: "",
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

	const updateProfile = async (data: any) => {
		const response = await api.post("/user/settings/profile", data);
		return response.data;
	};

	const updateAdmin = async (data: any) => {
		const response = await api.post("/user/settings/admin", data);
		return response.data;
	};

	const updateUserPassword = async (data: any) => {
		const response = await api.post("/user/settings/password", data);
		return response.data;
	};

	const { mutate: updateProfileMutation, isLoading: isProfileUpdating } =
		useMutation(updateProfile, {
			onSuccess: (data) => {
				client.invalidateQueries(["fetchSettingsData"]);
				showNotification({
					message: "Your profile has been updated successfully",
				});
			},
			onError: (error) => handleError(error),
		});
	const { mutate: updateAdminMutation, isLoading: isAdminUpdating } =
		useMutation(updateAdmin, {
			onSuccess: (data) => {
				client.invalidateQueries(["fetchSettingsData"]);
				showNotification({
					message: "Your profile has been updated successfully",
				});
			},
			onError: (error) => handleError(error),
		});

	const { mutate: updateUserPasswordMutation, isLoading: isPasswordUpdating } =
		useMutation(updateUserPassword, {
			onSuccess: (data) => {
				client.invalidateQueries(["fetchSettingsData"]);
				showNotification({
					message: "Your password has been updated successfully",
				});
			},
			onError: (error) => handleError(error),
		});
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
							<Button
								color="teal"
								leftIcon={<File />}
								onClick={() => updateProfileMutation(profileChange)}
								loading={isProfileUpdating}
							>
								Update Profile
							</Button>
						</Group>
					</Paper>
					<Divider my="md" variant="dashed" label="Update Password" />
					<Paper p={"md"}>
						<form
							onSubmit={pwdForm.onSubmit((data: any) => {
								updateUserPasswordMutation(data);
							})}
						>
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
								{...pwdForm.getInputProps("confPassword")}
							/>
							<Group mt="md" position="right">
								<Button
									loading={isPasswordUpdating}
									type="submit"
									color="teal"
									leftIcon={<File />}
								>
									Update Password
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
												setAdminChange({
													[item.id]: value,
												});
											}}
										/>
									</div>
								))}
								<Group mt="md" position="right">
									<Button
										onClick={() => updateAdminMutation(adminChange)}
										loading={isAdminUpdating}
										color="teal"
										leftIcon={<File />}
									>
										Update Admin Settings
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
