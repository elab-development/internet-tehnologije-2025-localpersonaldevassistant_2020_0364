import "./Sessions.css";
import { useEffect, useState } from "react";
import CommunicationController from "../communication/CommunicationController";
import SessionTile from "./SessionTile";
import type { Session } from "../types/types";

const Sessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    CommunicationController.sendRequest("GET", "/api/chat/sessions", {}).then((response) => {
      console.log(response);
      if (response.ok) {
        const fetchedSessions = response.payload as Session[];

        console.log("Fetched sessions:", fetchedSessions);
        setSessions(fetchedSessions);
      } else {
        console.error("Failed to fetch sessions:", response);
      }
    });
  }, []);

  return (
    <div id="sessionsContainer">
      <h3>Sessions</h3>
      {sessions && sessions.map((session) => <SessionTile key={session.id} id={session.id} title={session.title} />)}
    </div>
  );
};

export default Sessions;
