import { AdScreen } from "@/components/AdScreen";
import { TraditionalAdScreen } from "@/components/TraditionalAdScreen";
import { getAdVariant } from "@/lib/experiment";

export default async function Home({ searchParams }: { searchParams: Promise<{ variant?: string }> }) {
  const { variant } = await searchParams;
  return getAdVariant(variant) === "traditional" ? <TraditionalAdScreen /> : <AdScreen />;
}
