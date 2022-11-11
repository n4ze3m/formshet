import { CourierClient } from "@trycourier/courier";

export const sendNotification = async (
	email: string,
	message: string,
	preview: string,
    url: string,
) => {
	if (
		process.env.FORMSHET_NOTIFICATIONS_PROVIDER === "courier" &&
		process.env.FORMSHET_COURIER_AUTH_TOKEN &&
		process.env.FORMSHET_COURIER_TEMPLATE_ID
	) {
		const courier = CourierClient({
			authorizationToken: process.env.FORMSHET_COURIER_AUTH_TOKEN,
		});
		const { requestId } = await courier.send({
			message: {
				to: {
					email: email
				},
				template: process.env.FORMSHET_COURIER_TEMPLATE_ID,
				data: {
                    message: message,
                    preview: preview,
                    url: url
                },
			},
		});

        return requestId;
	}

    return null;
};
