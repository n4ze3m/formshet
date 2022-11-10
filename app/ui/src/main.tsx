import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { NotificationsProvider } from "@mantine/notifications";
import { AuthProvider } from "./hooks/useAuth";
import { BrowserRouter } from "react-router-dom";
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <MantineProvider
          withGlobalStyles={true}
          withNormalizeCSS={true}
          theme={{
            colorScheme: "dark",
            fontFamily: "Poppins",
          }}
        >
          <NotificationsProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </NotificationsProvider>
        </MantineProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
