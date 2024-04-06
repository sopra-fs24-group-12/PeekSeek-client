import React from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, RadioGroup, Radio} from "@nextui-org/react";

const colors = ["default", "secondary"];

export default function App() {
  const [selectedColor, setSelectedColor] = React.useState("default");

  return (
    <div className="flex flex-col gap-3">
      <Table 
        color={"default"}
        selectionMode="single" 
        defaultSelectedKeys={["2"]} 
        aria-label="Example static collection table"
      >
        <TableHeader>
          <TableColumn>LOBBY NAME</TableColumn>
          <TableColumn>PARTICIPANTS</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow key="1">
            <TableCell>LOBBY A</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow key="2">
            <TableCell>LOBBY B</TableCell>
            <TableCell>3</TableCell>
          </TableRow>
          <TableRow key="3">
            <TableCell>LOBBY C</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow key="4">
            <TableCell>LOBBY D</TableCell>
            <TableCell>5</TableCell>
          </TableRow>
          <TableRow key="1">
            <TableCell>LOBBY A</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow key="2">
            <TableCell>LOBBY B</TableCell>
            <TableCell>3</TableCell>
          </TableRow>
          <TableRow key="3">
            <TableCell>LOBBY C</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow key="4">
            <TableCell>LOBBY D</TableCell>
            <TableCell>5</TableCell>
          </TableRow>
          <TableRow key="1">
            <TableCell>LOBBY A</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow key="2">
            <TableCell>LOBBY B</TableCell>
            <TableCell>3</TableCell>
          </TableRow>
          <TableRow key="3">
            <TableCell>LOBBY C</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow key="4">
            <TableCell>LOBBY D</TableCell>
            <TableCell>5</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
