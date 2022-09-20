import { showNotification } from "@mantine/notifications";
import axios from "axios";

export const handleError = (error: any) => {
  let message: string = "Client Error";
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const data = error.response.data as any;
      message = data?.message || data?.error || "Internal Server Error";
    }
  } else {
    message = error?.message || "Internal Server Error";
  }
  showNotification({
    title: "Error",
    message: message,
    color: "red",
  });
};

export const errorMessage = (error: any) => {
  let message: string = "Client Error";
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const data = error.response.data as any;
      message = data?.message || data?.error || "Internal Server Error";
    }
  } else {
    message = error?.message || "Internal Server Error";
  }
  return message;
};
