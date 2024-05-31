import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { authMiddleware } from "@clerk/nextjs";

// export default authMiddleware({
//   ignoredRoutes: ["/api/webhooks(.*)"],
// });

const isProtectedRoute = createRouteMatcher([
  "/forum(.*)",
  // "/api/webhook",
  "/ask-question",
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
