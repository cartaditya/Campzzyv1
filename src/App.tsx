import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNotificationsOverlay, NotificationsOverlayProvider } from "./app/components/shared/notifications-overlay-context";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ArenaPage } from "./app/components/arena/ArenaPage";
import { GamesPage } from "./app/components/games";
import { ProfilePage } from "./app/components/profile";
import { NotificationsOverlay } from "./app/components/shared";
import { VerificationPage } from "./app/components/verify/VerificationPage";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isNotificationsOpen, closeNotifications } = useNotificationsOverlay();

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/arena" element={<ArenaPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/verify" element={<VerificationPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <NotificationsOverlay open={isNotificationsOpen} onClose={closeNotifications} />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NotificationsOverlayProvider>
          <AppRoutes />
        </NotificationsOverlayProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
