"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { initializeAnalytics, trackEvent } from "@/lib/analytics";

export function TraditionalAdScreen() {
  const router = useRouter();
  useEffect(() => { initializeAnalytics(window.location.search); trackEvent("variant_assigned"); trackEvent("ad_viewed"); }, []);
  function openPlanner() {
    const params = new URLSearchParams(window.location.search); params.set("variant", "traditional");
    trackEvent("traditional_cta_clicked");
    router.push(`/planner?${params.toString()}`);
  }

  return <main className="phone-shell ad-page traditional-page">
    <section className="social-top"><span className="avatar" /> <span>travel notes</span><span className="dots">•••</span></section>
    <section className="tokyo-visual"><div className="sun" /><div className="skyline" /><div className="tokyo-title">TOKYO <small>도쿄 여행 가이드</small></div><span className="location">● Shibuya, Tokyo</span></section>
    <section className="traditional-card"><div className="sponsored">SPONSORED · TOKYO STAYS</div><h1>도쿄의 특별한 숙소를<br />찾아보세요</h1><p>시부야부터 긴자까지, 여행에 어울리는 숙소를 한눈에 비교해 보세요.</p>
      <div className="traditional-details"><span>★ 8.6 이상</span><span>무료 취소</span><span>1박 ₩195,000부터</span></div>
      <button type="button" onClick={openPlanner}>도쿄 숙소 둘러보기 <span>→</span></button>
    </section>
    <footer>This is an academic prototype and is not affiliated with Booking.com.</footer>
  </main>;
}
