import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/react";
import ContentWrapper from "./ContentWrapper";

interface LeaderboardEntry {
  rank: number;
  name: string;
  basePoints: number;
  bonusPoints: number;
}

interface LeaderboardProps {
  data: LeaderboardEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ data }) => {
  const columns = [
    { key: "rank", label: "RANK" },
    { key: "name", label: "NAME" },
    { key: "totalPoints", label: "TOTAL POINTS" },
  ];


  const rows = data.map(entry => ({
    ...entry,
    totalPoints: `${entry.basePoints} + ${entry.bonusPoints}`,
  }));

  return (
    <ContentWrapper>
      <div
        className="p-2"
      >
        <h4 className="font-bold text-large text-center">LEADERBOARD</h4>
      </div>

      <Table
        removeWrapper
        aria-label="Leaderboard"
      >
        <TableHeader columns={columns}>
          {column => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={rows}>
          {item => (
            <TableRow key={item.rank}>
              {columnKey => {
                // Special handling for the 'totalPoints' to style the bonus points part
                if (columnKey === "totalPoints") {
                  return (
                    <TableCell>
                      {item.basePoints} <span style={{ color: "green" }}>+ {item.bonusPoints}</span>
                    </TableCell>
                  );
                }
                // Default rendering for other cells
              
                return <TableCell>{getKeyValue(item, columnKey)}</TableCell>;
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ContentWrapper>

  );
};

export default Leaderboard;
