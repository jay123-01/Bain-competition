import { PlannerScreen } from "@/components/PlannerScreen";
export default async function PlannerPage({ searchParams }: { searchParams: Promise<{ variant?: string }> }) { const { variant = "conversation" } = await searchParams; return <PlannerScreen variant={variant} />; }
