import type React from "react";
import { formatDate, formatRupiah } from "@/lib/utils";
import type { Ticket } from "../../../../_models/response/ticket";
import DefaultTeamLogo from "@/app/assets/images/default-team.svg";
import Image from "next/image";

export default function TicketCardExport({
  ticketsList,
}: {
  ticketsList: Ticket[];
}) {
  const containerStyle: React.CSSProperties = {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#ffffff",
    padding: "20px",
    color: "#000000",
  };

  const ticketCardStyle: React.CSSProperties = {
    marginBottom: "30px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    overflow: "hidden",
    pageBreakInside: "avoid",
  };

  const ticketHeaderStyle: React.CSSProperties = {
    backgroundColor: "#f9fafb",
    padding: "16px",
    borderBottom: "1px solid #e5e7eb",
  };

  const ticketTitleStyle: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "12px",
    color: "#1f2937",
  };

  const ticketInfoRowStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    alignItems: "center",
  };

  const infoItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
    color: "#374151",
  };

  const iconStyle: React.CSSProperties = {
    width: "16px",
    height: "16px",
    color: "#6b7280",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  };

  const tableHeaderStyle: React.CSSProperties = {
    backgroundColor: "#f3f4f6",
    fontWeight: "bold",
    textAlign: "left",
    padding: "12px",
    borderBottom: "2px solid #e5e7eb",
    verticalAlign: "middle",
  };

  const tableCellStyle: React.CSSProperties = {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
    verticalAlign: "middle",
    height: "60px",
  };

  const teamContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    verticalAlign: "middle",
    gap: "30px",
    minWidth: "400px",
    height: "100%",
    minHeight: "40px",
  };

  const teamStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    verticalAlign: "middle",
    gap: "8px",
    minWidth: "150px",
    flex: "0 0 auto",
  };

  const vsStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    verticalAlign: "middle",
    width: "32px",
    height: "32px",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    borderRadius: "50%",
    fontSize: "12px",
    fontWeight: "bold",
    flexShrink: 0,
  };

  const teamNameStyle: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: "500",
    lineHeight: "1.2",
  };

  const timeCellStyle: React.CSSProperties = {
    ...tableCellStyle,
    textAlign: "center",
  };

  const venueCellStyle: React.CSSProperties = {
    ...tableCellStyle,
    textTransform: "uppercase",
    textAlign: "center",
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: "center",
    padding: "40px",
    color: "#6b7280",
  };

  const emptyIconStyle: React.CSSProperties = {
    width: "64px",
    height: "64px",
    margin: "0 auto 16px",
    opacity: 0.5,
  };

  return (
    <div style={containerStyle}>
      {ticketsList.map((ticket) => (
        <div key={ticket.id} style={ticketCardStyle}>
          {/* Ticket Header */}
          <div style={ticketHeaderStyle}>
            <h2 style={ticketTitleStyle}>{ticket.name}</h2>
            <div style={ticketInfoRowStyle}>
              <div style={infoItemStyle}>
                <span style={iconStyle}>🏷️</span>
                <span>Harga Tiket: {formatRupiah(ticket.price || 0)}</span>
              </div>
              <div style={infoItemStyle}>
                <span style={iconStyle}>📊</span>
                <span>Kuota Tiket: {ticket.quota.stock}</span>
              </div>
              <div style={infoItemStyle}>
                <span style={iconStyle}>📈</span>
                <span>Sisa Kuota: {ticket.quota.remaining}</span>
              </div>
              <div style={infoItemStyle}>
                <span style={iconStyle}>📅</span>
                <span>{formatDate(ticket.date)}</span>
              </div>
            </div>
          </div>

          {/* Matches Table */}
          <div>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>Tim Yang Bertanding</th>
                  <th style={tableHeaderStyle}>Waktu</th>
                  <th style={tableHeaderStyle}>Tempat/Kota</th>
                </tr>
              </thead>
              <tbody>
                {!ticket.matchs || ticket.matchs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      style={{ ...tableCellStyle, ...emptyStateStyle }}
                    >
                      <div style={emptyIconStyle}>📦</div>
                      <h3
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          marginBottom: "8px",
                        }}
                      >
                        Belum Ada Data Jadwal Pertandingan
                      </h3>
                      <p style={{ color: "#6b7280" }}>
                        Silahkan Atur Jadwal Pertandingan
                      </p>
                    </td>
                  </tr>
                ) : (
                  ticket.matchs.map((match, index) => (
                    <tr key={index}>
                      <td style={tableCellStyle}>
                        <div style={teamContainerStyle}>
                          <div style={teamStyle}>
                            <div
                              style={{
                                position: "relative",
                                width: "30px",
                                height: "30px",
                                flexShrink: 0,
                                overflow: "hidden",
                              }}
                            >
                              <Image
                                src={
                                  match.homeSeasonTeam.team.logo === ""
                                    ? DefaultTeamLogo
                                    : match.homeSeasonTeam.team.logo
                                }
                                alt="team logo"
                                fill
                                style={{
                                  objectFit: "contain",
                                }}
                              />
                            </div>
                            <span style={teamNameStyle}>
                              {match.homeSeasonTeam.team.name || "Team Unknown"}
                            </span>
                          </div>
                          <div style={vsStyle}>VS</div>
                          <div style={teamStyle}>
                            <div
                              style={{
                                position: "relative",
                                width: "30px",
                                height: "30px",
                                flexShrink: 0,
                                overflow: "hidden",
                              }}
                            >
                              <Image
                                src={
                                  match.awaySeasonTeam.team.logo === ""
                                    ? DefaultTeamLogo
                                    : match.awaySeasonTeam.team.logo
                                }
                                alt="team logo"
                                fill
                                style={{
                                  objectFit: "contain",
                                }}
                              />
                            </div>
                            <span style={teamNameStyle}>
                              {match.awaySeasonTeam.team.name || "Team Unknown"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td style={timeCellStyle}>{match.time}</td>
                      <td style={venueCellStyle}>{match.venue?.name || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
