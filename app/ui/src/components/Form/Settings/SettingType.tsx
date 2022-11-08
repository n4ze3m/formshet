import {
  ActionIcon,
  Box,
  Button,
  CopyButton,
  Input,
  Overlay,
  Switch,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { Clipboard, ClipboardCheck } from "tabler-icons-react";

type IProps = {
  id: string;
  type: string;
  value: string | boolean | number;
  blur: boolean;
  onChange: (value?: any) => void;
};

export const SettingType = ({ id, type, value, onChange, blur }: IProps) => {
  switch (type) {
    case "text":
      return (
        <TextInput
          key={id}
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
          checked={value as boolean}
          onChange={(e) => onChange(e.currentTarget.checked)}
        />
      );

    case "copy":
      return (
        <Box
          style={{
            width: "50%",
          }}
        >
          {blur && <Overlay opacity={0.6} blur={2} color="#000" />}
          <Input
            key={id}
            value={value as string}
            readOnly
            rightSection={
              <CopyButton key={id} value={value as string} timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip
                    label={copied ? "Copied" : "Copy"}
                    withArrow
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
                )}
              </CopyButton>
            }
          />
        </Box>
      );

    default:
      return <div>Unknown type</div>;
  }
};
