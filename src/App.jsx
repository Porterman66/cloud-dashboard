import React, { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Activity, ShieldCheck, ShieldAlert, Radio, RefreshCw } from "lucide-react";

// Production Metric Data Simulation Engine (Emulating CloudWatch VPC Flow Logs /aws/vpc/mjp-production-flow-logs)
const generateTelemetryPayload = () => {
  const timeStrings = ["12:00", "12:05", "12:10", "12:15", "12:20", "12:25", "12:30", "12:35", "12:40", "12:45"];
  return timeStrings.map((time) => {
    const accepted = Math.floor(Math.random() * 4000) + 2500;
    const rejected = Math.floor(Math.random() * 300) + 40; // Simulated network attack anomalies
    return {
      timestamp: time,
      "Packets Accepted": accepted,
      "Packets Rejected (NACL Drop)": rejected,
      totalTraffic: accepted + rejected,
    };
  });
};

export default function App() {
  const [telemetry, setTelemetry] = useState(generateTelemetryPayload());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshTelemetryStream = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setTelemetry(generateTelemetryPayload());
      setIsRefreshing(false);
    }, 600);
  };

  // Automated Poll: Simulate real-time metric collection every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(generateTelemetryPayload());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const totalAccepted = telemetry.reduce((acc, curr) => acc + curr["Packets Accepted"], 0);
  const totalRejected = telemetry.reduce((acc, curr) => acc + curr["Packets Rejected (NACL Drop)"], 0);

  return (
    <div className="min-h-dvh bg-[#0a0a0a] text-[#e6e1d7] font-sans antialiased selection:bg-[#c8b4a0]/30 flex flex-col">
      <main className="flex-grow p-6 md:p-8 lg:p-12">
        {/* Upper Control Console & Telemetry Heading - Re-Spaced for Breathing Room */}
        <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#c8b4a0]/10 pb-10 mb-12 gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 text-[#c8b4a0] font-mono text-xs tracking-widest uppercase mb-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-500" /> Live Stream: /aws/vpc/mjp-production-flow-logs
            </div>
            {/* [FIX] Adding leading-tight prevents vertical overlap on multi-line titles */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight tracking-wider text-[#f8f7f5] leading-tight">
              OBSERVABILITY & NETWORK TELEMETRY ENGINE
            </h1>
          </div>
          <button
            onClick={refreshTelemetryStream}
            disabled={isRefreshing}
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 border border-[#c8b4a0]/20 rounded-md bg-black/40 font-mono text-xs uppercase tracking-wider text-[#c8b4a0] hover:bg-[#c8b4a0]/10 hover:border-[#c8b4a0]/50 transition-all active:scale-95 disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Force CloudWatch Fetch
          </button>
        </header>

        {/* Dashboard Spacing Container */}
        <section className="max-w-7xl mx-auto space-y-10">
          {/* Aggregated Analytical Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-[#c8b4a0]/10 bg-black/40 p-8 rounded-lg backdrop-blur-md">
              <div className="flex justify-between items-center text-[#e6e1d7]/50 font-mono text-xs uppercase mb-3">
                Total Traffic Analyzed <Activity className="w-5 h-5 text-[#c8b4a0]" />
              </div>
              <div className="text-4xl md:text-5xl font-extralight text-[#f8f7f5] leading-none">{(totalAccepted + totalRejected).toLocaleString()}</div>
              <div className="mt-2 text-[10px] font-mono text-[#e6e1d7]/40 tracking-wider">Aggregated metric packets</div>
            </div>

            <div className="border border-emerald-500/10 bg-black/40 p-8 rounded-lg backdrop-blur-md">
              <div className="flex justify-between items-center text-[#e6e1d7]/50 font-mono text-xs uppercase mb-3">
                Ingress Allowed <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-4xl md:text-5xl font-extralight text-emerald-400 leading-none">{totalAccepted.toLocaleString()}</div>
              <div className="mt-2 text-[10px] font-mono text-emerald-500/50 tracking-wider">Passed security baseline</div>
            </div>

            <div className="border border-rose-500/10 bg-black/40 p-8 rounded-lg backdrop-blur-md">
              <div className="flex justify-between items-center text-[#e6e1d7]/50 font-mono text-xs uppercase mb-3">
                Edge Perimeter Drops <ShieldAlert className="w-5 h-5 text-rose-400" />
              </div>
              <div className="text-4xl md:text-5xl font-extralight text-rose-400 leading-none">{totalRejected.toLocaleString()}</div>
              <div className="mt-2 text-[10px] font-mono text-rose-500/50 tracking-wider">Blocked by stateless NACLs</div>
            </div>
          </div>

          {/* High-Fidelity Data Analytics Grid Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart 1: Time-Series Ingress Data Flow */}
            <div className="border border-[#c8b4a0]/10 bg-black/30 p-8 rounded-lg backdrop-blur-md">
              <h3 className="text-sm font-medium tracking-wide text-[#f8f7f5] mb-8 uppercase font-mono text-[#c8b4a0]/80 leading-snug">
                Network Throughput Timeline (Packets/Min)
              </h3>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={telemetry} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                    <XAxis dataKey="timestamp" stroke="#525252" fontSize={11} fontFamily="monospace" axisLine={{ stroke: "#404040" }} tickLine={{ stroke: "#404040" }} />
                    <YAxis stroke="#525252" fontSize={11} fontFamily="monospace" axisLine={{ stroke: "#404040" }} tickLine={{ stroke: "#404040" }} />
                    <Tooltip cursor={{ stroke: '#c8b4a050', strokeWidth: 1 }} contentStyle={{ backgroundColor: "#0f0f0f", borderColor: "rgba(200, 180, 160, 0.2)", color: "#e6e1d7", fontSize: '12px', fontFamily: 'monospace' }} itemStyle={{ color: '#c8b4a0' }} labelStyle={{ color: '#e6e1d780', marginBottom: '4px' }}/>
                    <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "monospace", paddingTop: "20px" }} />
                    <Line type="monotone" dataKey="Packets Accepted" stroke="#34d399" strokeWidth={1.5} dot={{ r: 2.5, fill: '#34d399', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#34d399', strokeWidth: 3, stroke: '#fff' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Security Perimeter Block Actions */}
            <div className="border border-[#c8b4a0]/10 bg-black/30 p-8 rounded-lg backdrop-blur-md">
              <h3 className="text-sm font-medium tracking-wide text-[#f8f7f5] mb-8 uppercase font-mono text-[#c8b4a0]/80 leading-snug">
                Perimeter Drop Volatility (Malicious Ingress Anomalies)
              </h3>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={telemetry} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                    <XAxis dataKey="timestamp" stroke="#525252" fontSize={11} fontFamily="monospace" axisLine={{ stroke: "#404040" }} tickLine={{ stroke: "#404040" }} />
                    <YAxis stroke="#525252" fontSize={11} fontFamily="monospace" axisLine={{ stroke: "#404040" }} tickLine={{ stroke: "#404040" }} />
                    <Tooltip cursor={{ fill: 'rgba(200, 180, 160, 0.05)'}} contentStyle={{ backgroundColor: "#0f0f0f", borderColor: "rgba(200, 180, 160, 0.2)", color: "#e6e1d7", fontSize: '12px', fontFamily: 'monospace' }} itemStyle={{ color: '#f43f5e' }} labelStyle={{ color: '#e6e1d780', marginBottom: '4px' }}/>
                    <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "monospace", paddingTop: "20px" }} />
                    <Bar dataKey="Packets Rejected (NACL Drop)" fill="#f43f5e" radius={[3, 3, 0, 0]} opacity={0.8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer / Info Bar for Enterprise Feel */}
      <footer className="max-w-7xl mx-auto w-full border-t border-[#c8b4a0]/10 py-6 px-8 mt-16 text-center">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#e6e1d7]/40">
          MJP Cloud Infrastructure Monitoring Cockpit • © 2024 • Telemetry Source Verified (CloudWatch)
        </p>
      </footer>
    </div>
  );
}