import { Table, ScrollArea, Paper, createStyles, Center, Text, Container } from "@mantine/core";
import React from "react";

const useStyles = createStyles((theme) => ({
  header: {
    position: "sticky",
    top: 0,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[2]
        }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
  // yes i know how to centerlize a div
  noData: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    padding: "10px"
  }
}));

type Props = {
  header: string[][];
  data: { [key: string]: string | number | boolean }[];
};

export const FormTable = ({ header, data }: Props) => {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = React.useState(false);
  const rows = data.map((row, index) => (
    <tr key={index}>
      {header.map((r) => r.map((c) => <td key={c}>{row[c]}</td>))}
    </tr>
  ));

  return (
    <Paper withBorder shadow="sm" p="md">
      <ScrollArea onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
        <Table sx={{ minWidth: 800 }} verticalSpacing="xs">
          <thead
            className={cx(classes.header, { [classes.scrolled]: scrolled })}
          >
            <tr>{header.map((r) => r.map((c) => <th key={c}>{c}</th>))}</tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        {
          rows.length === 0 && (
            <Container
              style={{
                height: 300,
              }}
            >
              <div
                className={classes.noData}
              >
                <Text
                  align="center"
                >
                  {`No data found`}
                </Text>
              </div>
            </Container>
          )
        }
      </ScrollArea>
    </Paper>
  );
};
