import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/react";
import ContentWrapper from "./ContentWrapper";
import { PiMedalFill } from "react-icons/pi";
import { FaFireFlameCurved } from "react-icons/fa6";

interface LeaderboardEntry {
  rank: number;
  name: string;
  basePoints: number;
  bonusPoints: number;
  streak: number;
  hasLeft: boolean;
}

interface LeaderboardProps {
  data: LeaderboardEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ data }) => {
  const columns = [
    { key: "trophy", label: ""},
    { key: "rank", label: "RANK" },
    { key: "name", label: "NAME" },
    { key: "totalPoints", label: "TOTAL POINTS" },
    { key: "streakCount", label: ""},
  ];


  const rows = data.map(entry => ({
    ...entry,
    totalPoints: `${entry.basePoints} + ${entry.bonusPoints}`,
    trophy: (entry.rank === 1 ? <PiMedalFill color="gold" />: entry.rank === 2 ? <PiMedalFill color="silver" />: entry.rank === 3 ? <PiMedalFill color="#cd7f32" /> : null),
    streakCount: (entry.streak > 1 ? <><FaFireFlameCurved color="orange" />x{entry.streak}</> : null)
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
                      <span style={{ color: item.hasLeft ? "grey" : "inherit" }}>
                        {item.basePoints}
                      </span>{" "}
                      <span style={{ color: item.hasLeft ? "grey": "green" }}>+{item.bonusPoints}</span>
                    </TableCell>
                  );
                }

                return (
                  <TableCell>
                    <span style={{ color: item.hasLeft ? "grey" : "inherit" }}>
                      {getKeyValue(item, columnKey)}
                    </span>
                  </TableCell>
                );
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ContentWrapper>

  );
};

export default Leaderboard;
