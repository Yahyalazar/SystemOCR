import * as React from "react";
import { useState, useEffect } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as XLSX from "xlsx"; // Import xlsx library

// Define types for the incoming jsonData
interface Player {
  id?: number;
  First_name_and_Last_name?: string;
  license_number?: string;
  cin_number?: string | undefined;
  order_number?: number | undefined;
}

interface HeaderInformation {
  organization: string;
  organization_in_arabic: string;
  subtitle: string;
  "Date d'enregistrement": string;
  Saison: string;
  title: string;
}

interface JsonData {
  "Header Information": HeaderInformation;
  "Player Data": Player[];
}

export default function DataDisplay({ jsonData }: { jsonData: JsonData }) {
  type Writable<T> = { -readonly [P in keyof T]: T[P] };
type SafeUpdate<T> = {
  [K in keyof T]: T[K] extends string | number | undefined
    ? string | undefined
    : T[K];
};
  const [playerData, setPlayerData] = useState<Player[]>(
    jsonData?.["Player Data"] || []
  );
  const [season, setSeason] = useState(
    jsonData?.["Header Information"]?.Saison || ""
  );
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
  // Handle input changes
  const handleEdit = (index: number, field: keyof Player, value: string) => {
    const updatedData = [...playerData];
  
    // Safely assign value to the field based on field type
    (updatedData[index] as Writable<SafeUpdate<Player>>)[field] = value;
    setPlayerData(updatedData);
  };

  // Handle season change if dropdown is used
  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSeason(e.target.value);
  };

  // Export to Excel function
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Add Header Information as a sheet
    const headerSheet = XLSX.utils.json_to_sheet([
      {
        Organisation: jsonData["Header Information"].organization,
        Saison: season,
        "Date d'enregistrement":
          jsonData["Header Information"]["Date d'enregistrement"],
      },
    ]);
    XLSX.utils.book_append_sheet(wb, headerSheet, "Informations de l'entête");

    // Add Player Data as a sheet
    const playerSheet = XLSX.utils.json_to_sheet(playerData, {
      header: [
        "id",
        "First_name_and_Last_name",
        "license_number",
        "cin_number",
        "order_number",
      ], // Explicit header
      skipHeader: false, // Ensure header is included in the sheet
    });
    XLSX.utils.book_append_sheet(wb, playerSheet, "Données des joueurs");

    // Generate the Excel file and trigger the download
    XLSX.writeFile(wb, "PlayerData.xlsx");
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">
            {jsonData?.["Header Information"]?.title || "Données"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Organisation
              </p>
              <p className="text-lg font-semibold">
                {jsonData?.["Header Information"]?.organization || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Organisation (Arabe)
              </p>
              <p className="text-lg font-semibold">
                {jsonData?.["Header Information"]?.organization_in_arabic ||
                  "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Sous-titre
              </p>
              <p className="text-lg font-semibold">
                {jsonData?.["Header Information"]?.subtitle || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p className="text-lg font-semibold">
                {jsonData?.["Header Information"]?.["Date d'enregistrement"] ||
                  "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Saison
              </p>
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
          <CardTitle className="text-2xl font-bold text-primary">
            Données des joueurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {playerData.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Numéro de licence</TableHead>
                    <TableHead>Numéro CIN</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Numéro de commande</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {playerData.map((player, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <input
                          type="text"
                          value={player.license_number || ""}
                          onChange={(e) =>
                            handleEdit(index, "license_number", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="text"
                          value={player.cin_number || ""}
                          onChange={(e) =>
                            handleEdit(index, "cin_number", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="text"
                          value={player.First_name_and_Last_name || ""}
                          onChange={(e) =>
                            handleEdit(
                              index,
                              "First_name_and_Last_name",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="text"
                          value={player.order_number || ""}
                          onChange={(e) =>
                            handleEdit(index, "order_number", e.target.value)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-gray-500">Aucun joueur trouvé.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Button to export data to Excel */}
      <div className="flex justify-center mt-4">
        <button
          onClick={exportToExcel}
          className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Exporter vers Excel
        </button>
      </div>
    </div>
  );
}
