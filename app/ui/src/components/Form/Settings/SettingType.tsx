import { ActionIcon, Button, CopyButton, Input, Switch, TextInput, Tooltip } from "@mantine/core";
import { Clipboard, ClipboardCheck } from "tabler-icons-react";

type IProps = {
    id: string;
    type: string;
    value: string | boolean | number;
}

export const SettingType = ({ id, type, value }: IProps) => {
    switch (type) {

        case 'text':
            return <TextInput key={id} value={value as string} placeholder="Enter Text" style={{
                width: '100%'
            }}
                onChange={(e) => {
                    console.log(e.target.value);
                }}
            />
        case 'switch':
            return <Switch key={id} checked={value as boolean} onChange={(e) => { }} />

        case 'copy':
            return <Input key={id} value={value as string} readOnly
                rightSection={<CopyButton key={id} value={value as string} timeout={2000}>
                    {({ copied, copy }) => (
                        <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                            <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                                {copied ? <ClipboardCheck fontSize={16} /> : <Clipboard fontSize={16} />}
                            </ActionIcon>
                        </Tooltip>
                    )}
                </CopyButton>}
                style={{
                    width: '50%'
                }}
            />

        case 'delete':
            return <Button color="red" key={id} onClick={() => { }}>Delete</Button>

        default:
            return <div>Unknown type</div>


    }
}