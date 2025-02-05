"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/inputs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DataDisplay({ jsonData }) {
  const [playerData, setPlayerData] = useState(jsonData?.["Player Data"] || []);
  const [season, setSeason] = useState(jsonData?.["Header Information"]?.Saison || "");
  const seasons = ["2022/2023", "2023/2024", "2024/2025"]; // Replace with your actual list of seasons

  // Ensure the component updates when new jsonData is received
  useEffect(() => {
    if (jsonData?.["Player Data"]) {
      setPlayerData(jsonData["Player Data"]);
    }
    if (jsonData?.["Header Information"]?.Saison) {
      setSeason(jsonData["Header Information"]?.Saison);
    }
  }, [jsonData]);

  // Handle input changes
  const handleEdit = (index, field, value) => {
    const updatedData = [...playerData];
    updatedData[index][field] = value;
    setPlayerData(updatedData);
  };

  // Handle season change if dropdown is used
  const handleSeasonChange = (e) => {
    setSeason(e.target.value);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">{jsonData?.["Header Information"]?.title || "Data"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Organization</p>
              <p className="text-lg font-semibold">{jsonData?.["Header Information"]?.organization || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Organization (Arabic)</p>
              <p className="text-lg font-semibold">{jsonData?.["Header Information"]?.organization_in_arabic || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Subtitle</p>
              <p className="text-lg font-semibold">{jsonData?.["Header Information"]?.subtitle || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p className="text-lg font-semibold">{jsonData?.["Header Information"]?.["Date d'enregistrement"] || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Season</p>
              {season ? (
                <p className="text-lg font-semibold">{season}</p>
              ) : (
                <select
                  className="text-lg font-semibold border-2 border-gray-300 p-2"
                  onChange={handleSeasonChange}
                  value={season}
                >
                  {seasons.map((season, index) => (
                    <option key={index} value={season}>
                      {season}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Displaying Players */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Player Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {playerData.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>License Number</TableHead>
                    <TableHead>CIN Number</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Order Number</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {playerData.map((player, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          value={player.license_number || ""}
                          onChange={(e) => handleEdit(index, "license_number", e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          value={player.cin_number || ""}
                          onChange={(e) => handleEdit(index, "cin_number", e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          value={player.First_name_and_Last_name || ""}
                          onChange={(e) => handleEdit(index, "First_name_and_Last_name", e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          value={player.order_number || ""}
                          onChange={(e) => handleEdit(index, "order_number", e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-gray-500">No players found.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
