"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { initializeAnalytics, trackEvent } from "@/lib/analytics";
import { canStartPlanner } from "@/lib/ad-flow";
import { destinations } from "@/data/destinations";
import { MessageInput } from "./MessageInput";
import { TravelHero } from "./TravelHero";

export function AdScreen() {
  const router = useRouter(); const [draft, setDraft] = useState("");
  useEffect(() => { initializeAnalytics(window.location.search); trackEvent("variant_assigned"); trackEvent("ad_viewed"); }, []);
  function openPlanner() {
    if (!canStartPlanner(draft)) return;
    const params = new URLSearchParams(window.location.search); params.set("variant", "conversation");
    sessionStorage.setItem("trip-planner-draft", draft);
    trackEvent("ad_input_submitted");
    router.push(`/planner?${params.toString()}`);
  }
  function chooseDestination(destinationId: string, promptTemplate: string) {
    setDraft(promptTemplate);
    trackEvent("destination_chip_selected", { destination: destinationId });
  }
  return <main className="phone-shell ad-page">
    <section className="social-top"><span className="avatar" /> <span>travel notes</span><span className="dots">•••</span></section>
    <TravelHero />
    <section className="ad-card"><div className="sponsored">SPONSORED · AI TRIP PLANNER</div><h1>이번 가을, 어디로<br />떠나고 싶으세요?</h1><p>가고 싶은 도시를 골라보거나, 원하는 여행을 한 문장으로 말해보세요.</p>
      <div className="chips destination-chips">{destinations.map((destination) => <button key={destination.id} type="button" onClick={() => chooseDestination(destination.id, destination.promptTemplate)}>{destination.chipLabel}</button>)}</div>
      <MessageInput value={draft} onChange={setDraft} onSubmit={openPlanner} placeholder="친구들과 다음 달 4박 5일, 예산 150만원" />
      <span className="input-hint">메시지를 입력한 뒤 화살표를 눌러 시작하세요</span>
    </section>
    <footer>This is an academic prototype and is not affiliated with Booking.com.</footer>
  </main>;
}
