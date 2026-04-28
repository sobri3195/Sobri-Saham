import ChatBox from "@/components/ChatBox";

export default function ChatPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Chat Sobri Saham</h1>
      <p className="text-sm text-slate-600">Tanya analisa saham seperti: "Analisa BBCA" atau "Bandingkan BBRI dan BMRI".</p>
      <ChatBox />
    </div>
  );
}
