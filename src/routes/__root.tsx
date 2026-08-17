--- a/src/routes/__root.tsx
+++ b/src/routes/__root.tsx
@@
-import { LinkNotifications } from "@/lib/link-notifications";
+import { LinkNotifications } from "@/lib/link-notifications";
+import BottomNav from "@/components/BottomNav";
@@
 function RootComponent() {
   const { queryClient } = Route.useRouteContext();
   return (
     <QueryClientProvider client={queryClient}>
       <AuthProvider>
         <Outlet />
-        <LinkNotifications />
+        <LinkNotifications />
+        <BottomNav />
         <Toaster position="top-center" richColors />
       </AuthProvider>
     </QueryClientProvider>
   );
 }
