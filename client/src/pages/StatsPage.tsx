import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import CommunicationController from "../communication/CommunicationController";
import "./StatsPage.css";

type DailyStat = {
  date: string;
  count: number;
};

const StatsPage = () => {
  const [data, setData] = useState<DailyStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await CommunicationController.sendRequest("GET", "/api/chat/stats/daily", {});
        if (response.ok) {
          const rawData = response.payload as DailyStat[];
          setData(fillMissingDates(rawData));
        }
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const fillMissingDates = (existingData: DailyStat[]) => {
    const filled: DailyStat[] = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];

      const existing = existingData.find((item) => item.date === dateStr);
      filled.push({
        date: dateStr,
        count: existing ? existing.count : 0,
      });
    }
    return filled;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="customTooltip">
          <p className="label">{new Date(label).toDateString()}</p>
          <p className="count">Requests: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="statsPage">
      <div className="statsHeader">
        <h1>User Activity (Last 30 Days)</h1>
        <Link to="/chat" className="backBtn">
          ← Back to Chat
        </Link>
      </div>

      <div className="chartContainer">
        {loading ? (
          <p style={{ color: "var(--text-muted)", textAlign: "center" }}>Loading statistics...</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="date" tickFormatter={(str) => str.slice(5)} stroke="var(--text-muted)" tick={{ fontSize: 12 }} tickMargin={10} />
              <YAxis stroke="var(--text-muted)" allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
              <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default StatsPage;
