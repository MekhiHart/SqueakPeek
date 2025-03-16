import { NavBar } from "@/ui/navbar/NavBar";
import { createSupabaseServer } from "../../lib/supabase/server";
import { LiveNotifications } from "@/lib/store/LiveNotifications";
import { InitProfile } from "@/lib/store/InitProfile";
import { InterstitialManager } from "@/ui/interstitials/InterstitialManager";
/**
 * This layout file affects files in the (main) directory
 * The navigation bar is set to render in each page under the (main directory)
 */
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServer();
  const { data } = await supabase.auth.getUser();

  return (
    <>
      <NavBar />
      {children}
      <InitProfile user={data.user} />
      <LiveNotifications />
      <InterstitialManager />
    </>
  );
}
