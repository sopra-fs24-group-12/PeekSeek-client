import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

interface Props {
  players: string[];
}

const PlayerTable: React.FC<Props> = ({ players }) => {
  return (
    <div className="w-[250px] max-w-2xl ml-8 shadow-lg items-center">
      <Table color={"default"} aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>Players</TableColumn>
        </TableHeader>
        <TableBody>
          {players.map((player, index) => (
            <TableRow key={index}>
              <TableCell>{player}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PlayerTable;
