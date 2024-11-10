import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { trace, userHasExistingProfile } from "@/lib/actions/profile_setup"

//TODO review explore redirect logic: redirected to profile_setup but url shows as explore

trace("***** BEGIN middleware.ts ******");
trace("middleware.ts is always invoked!!!");

//allowed public paths
//TODO: rm test in prd stack
const publicPaths = ["/","/login", "/explore","/signup","/about"];

//whitelists auth'd user paths
const validUserPaths = ["/message", "/profile", "/thread", "/track", "/profile_setup"];

function isPublicPath(pathname: string){
  return publicPaths.includes(pathname);
}

function isAllowedUserPath(pathname: string){
  return validUserPaths.includes(pathname);
}

// refreshes expired Auth token
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  ); //end createServerClient

  //get Supabase user
  const { data: { user } } = await supabase.auth.getUser();

  //simple pathname variable
  const pathname = request.nextUrl.pathname;

  if (user){
    trace("USER " + user?.email? + " HAS AUTHENTICATED");
    
    //Task 1: Only allow authorized users to access the pages under the (main) directory
    //...using whitelist strategy
    trace("Task 1: Only allow authorized users to access the pages under the (main) directory");
    if(!(isAllowedUserPath(pathname)) && !(isPublicPath(pathname))) {
      const url = request.nextUrl.clone();
      url.pathname = "/explore";
      trace("User attempted to access a restricted path. Redirecting to /explore");
      return NextResponse.redirect(url);
    }

    // Task 3: Redirect authenticated users without a profile to /profile_setup
    let hasUserProfile = await userHasExistingProfile();
    const url = request.nextUrl.clone();
    if (!(hasUserProfile)) {
      trace("Task 3: Redirect authenticated users without a profile to /profile_setup");
      const url = request.nextUrl.clone();
        if (url.pathname.indexOf("/profile_setup") < 0){
        url.pathname = "/profile_setup";
        trace("redirecting to /profile_setup: user has no profile");
        return NextResponse.redirect(url);
      }
    }
    // Task 4: Redirect any users accessing /profile_setup that already has a profile to /404
    else if (hasUserProfile && pathname === "/profile_setup") {
    trace("Task 4: Redirect any users accessing /profile_setup that already has a profile to /404")
    const url = request.nextUrl.clone();
      url.pathname = "/404";
      return NextResponse.rewrite(url);
      }
    }
    else {
      trace("LOOP 3: didn't do either of the above: PATHNAME: " + pathname);
    }
  // Task 5: Redirect auth users navigating to /message to /message/company first
  if (request.nextUrl.pathname === "/message") {
    const url = request.nextUrl.clone();
    url.pathname = "/message/company";
    return NextResponse.redirect(url);
  }
  else if (!user) {
    trace("USER HAS NOT AUTHENTICATED");

    //Task 2: For authenticated users accessing the pages outside of (main)
    //automatically redirect them to the /explore route
    trace("Task 2: For authenticated users accessing the pages outside of (main) automatically redirect them to the /explore route");
    if(!isPublicPath(pathname)) {
      trace(pathname  + "is not a public path. Redirect to explore");
      const url = request.nextUrl.clone();
      url.pathname = "/explore";
      return NextResponse.redirect(url); 
    }
    else {
      trace(pathname  + "is a public path. Allowing access");
    }
  }
  return supabaseResponse;
} // end updateSession