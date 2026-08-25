"use client";

import { useEffect, useRef, useState } from "react";
import { hotels } from "@/data/hotels";
import { initializeAnalytics, trackEvent } from "@/lib/analytics";
import { getInitialPlannerPrompt } from "@/lib/ad-flow";
import { getPlannerErrorMessage, type PlannerApiReply } from "@/lib/planner-api";
import { buildPlannerReply, isQualifiedIntent, type TravelIntent } from "@/lib/planner-flow";
import { MessageInput } from "./MessageInput";

type Message = { role: "ai" | "user"; text: string };
export function PlannerScreen({ variant }: { variant: string }) {
  const [messages, setMessages] = useState<Message[]>([{ role: "ai", text: "안녕하세요! 어떤 여행을 계획하고 계세요?\n여행지, 기간, 예산, 누구와 가는지, 원하는 스타일을 편하게 말해주세요." }]);
  const [draft, setDraft] = useState(""); const [intent, setIntent] = useState<TravelIntent>({});
  const [loading, setLoading] = useState(false); const [result, setResult] = useState(false); const [modal, setModal] = useState<string | null>(null);
  const [chips, setChips] = useState<string[]>([]);
  const qualifiedSent = useRef(false);
  const firstPromptSent = useRef(false);
  useEffect(() => {
    initializeAnalytics(window.location.search);
    trackEvent("planner_started");
    const initialPrompt = getInitialPlannerPrompt(sessionStorage.getItem("trip-planner-draft"));
    sessionStorage.removeItem("trip-planner-draft");
    if (initialPrompt) submit(initialPrompt);
  }, [variant]);
  useEffect(() => { if (result) { trackEvent("trip_generated"); trackEvent("hotel_results_viewed"); } }, [result]);
  async function submit(value = draft) {
    if (!value.trim() || loading) return;
    setMessages((current) => [...current, { role: "user", text: value }]); setDraft(""); setChips([]);
    trackEvent(firstPromptSent.current ? "planner_message_submitted" : "first_prompt_submitted"); firstPromptSent.current = true;
    const fallback = buildPlannerReply(value); const merged = { ...intent, ...fallback.intent }; setIntent(merged);
    if (isQualifiedIntent(merged) && !qualifiedSent.current) { trackEvent("qualified_intent_created", { fieldCount: 4 }); qualifiedSent.current = true; }
    setLoading(true);
    try {
      const apiMessages = [...messages, { role: "user" as const, text: value }].map((message) => ({ role: message.role === "ai" ? "assistant" : "user", text: message.text }));
      const response = await fetch("/api/planner", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: apiMessages }) });
      if (!response.ok) {
        setLoading(false);
        setMessages((current) => [...current, { role: "ai", text: getPlannerErrorMessage(response.status) }]);
        return;
      }
      const reply = await response.json() as PlannerApiReply;
      setLoading(false);
      setMessages((current) => [...current, { role: "ai", text: reply.reply }]);
      setChips(reply.quickReplies);
      if (reply.tripReady) setTimeout(() => setResult(true), 650);
    } catch {
      setTimeout(() => {
        setLoading(false);
        if (fallback.kind === "follow-up") { setMessages((current) => [...current, { role: "ai", text: fallback.text }]); setChips(fallback.chips); } else setResult(true);
      }, 700);
    }
  }
  function chooseChip(chip: string) { const map: Record<string, string> = { "맛집": "맛집 위주로요", "쇼핑": "쇼핑 위주로요", "관광": "관광 위주로요", "휴양": "휴양 위주로요", "3박 4일 · 120만원 · 커플": "3박 4일, 예산 120만원, 여자친구와 함께예요" }; if (chip === "직접 입력할게요") return; submit(map[chip] ?? chip); }
  return <main className="phone-shell planner-page"><header className="planner-header"><div><b>AI Trip Planner</b><span>Tell me how you want to travel</span></div><em>Student Research Prototype</em></header>
    {!result ? <section className="chat"><div className="messages">{messages.map((message, index) => <div key={index} className={`bubble ${message.role}`}>{message.text}</div>)}{loading && <div className="bubble ai typing">여행을 맞춤 구성하고 있어요 <i /> <i /> <i /></div>}{chips.length > 0 && !loading && <div className="chips">{chips.map((chip) => <button key={chip} onClick={() => chooseChip(chip)}>{chip}</button>)}</div>}</div><div className="composer"><MessageInput autoFocus value={draft} onChange={setDraft} onSubmit={() => submit()} disabled={loading} placeholder="예: 여자친구와 일본 4일, 총 예산 120만원" /></div></section> : <Result intent={intent} onHotel={(name) => { trackEvent("hotel_cta_clicked", { hotel: name }); setModal(name); }} />}
    {modal && <div className="modal-backdrop"><section className="modal"><span className="check">✓</span><h2>예약 흐름을 확인했어요</h2><p>실제 서비스에서는 여기에서 예약 가능한 객실과 가격을 확인하게 됩니다.</p><button onClick={() => setModal(null)}>닫기</button></section></div>}
  </main>;
}

function Result({ intent, onHotel }: { intent: TravelIntent; onHotel: (name: string) => void }) { return <section className="result"><div className="result-kicker">YOUR PERSONALIZED TRIP</div><h1>도쿄 3박 4일 커플 여행</h1><p className="result-sub">맛집 중심 · 느긋한 도쿄 무드 · 예산 120만원</p><div className="days">{[["Day 1", "Shibuya / Daikanyama"], ["Day 2", "Tsukiji / Ginza / Ebisu"], ["Day 3", "Asakusa / Ueno"]].map(([day, route]) => <article key={day}><b>{day}</b><span>{route}</span></article>)}</div><h2>여행 취향에 맞는 숙소</h2><div className="hotel-list">{hotels.map((hotel) => <article className="hotel" key={hotel.id}><div className="hotel-image" /><div className="hotel-copy"><div><h3>{hotel.name}</h3><span>{hotel.area} · ★ {hotel.rating}</span></div><strong>₩{hotel.price.toLocaleString()}<small> / 1박</small></strong><div className="badges">{hotel.freeCancellation && <span>무료 취소</span>}{hotel.breakfast && <span>조식 포함</span>}</div><p>{hotel.reason}</p><button onClick={() => onHotel(hotel.name)}>숙소 자세히 보기 <span>→</span></button></div></article>)}</div></section>; }
