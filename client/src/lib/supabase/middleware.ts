import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { userHasExistingProfile } from "@/lib/actions/profile_setup"

//looked into making these Sets but couldn't quite implement the references yet
//allowed public paths
const publicPaths = new Set(["/","/login","/signup","/about","/auth/callback"]);

//whitelists auth'd user paths
const protectedPaths = new Set(["/message", "/explore", "/profile", "/thread", "/track", "/profile_setup"]);

//basePaths.has(pathname)
//may be a JavaScript way to do this easier with Sets... looking into it
function hasBasePath(pathname: string, basePaths: Set<string>): boolean {
  if (pathname == "/") return true;
  for (const basePath of basePaths) {
    if (basePath === "/") continue;
    if (pathname.startsWith(basePath)) {
      return true
    }
  }
  return false
}

//hasBasePath on publicPaths
function isPublicPath(pathname: string){
  return hasBasePath(pathname, publicPaths)
}

//hasBasePath on protectedPaths (protected paths)
function isAllowedUserPath(pathname: string){
  return hasBasePath(pathname, protectedPaths);
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
  
  //Auth user
  if (user) {
    const userEmail = user?.email;
    console.log("USER " + userEmail + " HAS AUTHENTICATED");
    
    // redirect authenticated users from home, login, and signup to explore
    if (pathname === "/" || pathname === "/signup" || pathname === "/login") {
      const url = request.nextUrl.clone();
      url.pathname = "/explore";
      return NextResponse.redirect(url);
    }

    // Only allow authorized users to access the pages under the (main) directory using whitelist strategy
    if(!(isAllowedUserPath(pathname)) && !(isPublicPath(pathname))) {
      const url = request.nextUrl.clone();
      if (url.pathname.indexOf("/404") < 0) {
        url.pathname = "/404";
        return NextResponse.redirect(url);
      }
    }

    // Redirect authenticated users without a profile to /profile_setup
    const hasUserProfile = await userHasExistingProfile();
    const url = request.nextUrl.clone();
    if (!(hasUserProfile)) {
      console.log("USER " + user?.email + " HAS NO PROFILE");
      
      //if not on profile_setup, redirect to profile_setup
      if (url.pathname.indexOf("/profile_setup") < 0) {
        if (!isPublicPath(pathname)){
          url.pathname = "/profile_setup";
          return NextResponse.redirect(url);
        }
      }
    } // end of handling of non auth'd users
    else {
      
      // Redirect any users accessing /profile_setup that already has a profile to /404
      console.log("USER " + user?.email + " HAS PROFILE");
      if (pathname === "/profile_setup") {
        console.log("USER " + user?.email + " ALREADY HAS PROFILE, redirecting to 404");
        const url = request.nextUrl.clone();
        url.pathname = "/404";
        return NextResponse.rewrite(url);
      }
      
      // Task 5: Redirect auth users navigating to /message to /message/company first
      if (pathname === "/message") {
        const url = request.nextUrl.clone();
        url.pathname = "/message/company";
        return NextResponse.redirect(url);
      }
    } // end handling of auth'd users
  }
  else {
    console.log("USER HAS NOT AUTHENTICATED");

    // For authenticated users accessing the pages outside of (main) automatically redirect them to the /404 route
    if(!isPublicPath(pathname)) {
      const url = request.nextUrl.clone();
      if (url.pathname.indexOf("/404") < 0) {
        console.log(pathname  + " is not a public path. Redirect to 404");
        url.pathname = "/404";
        return NextResponse.redirect(url); 
      }
    }
    else {
      console.log(pathname  + " is a public path. Allowing access");
    }
  }
  return supabaseResponse;
} // end updateSession