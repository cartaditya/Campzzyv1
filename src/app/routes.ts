import { createBrowserRouter } from "react-router";
import { AuthPage } from "./components/auth/AuthPage";
import { ArenaPage } from "./components/arena/ArenaPage";
import { VideoCallPage } from "./components/video/VideoCallPage";
import { GamesPage } from "./components/games/GamesPage";
import { ProfilePage } from "./components/profile/ProfilePage";
import { VerificationPage } from "./components/verify/VerificationPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AuthPage,
  },
  {
    path: "/arena",
    Component: ArenaPage,
  },
  {
    path: "/video",
    Component: VideoCallPage,
  },
  {
    path: "/games",
    Component: GamesPage,
  },
  {
    path: "/profile",
    Component: ProfilePage,
  },
  {
    path: "/verify",
    Component: VerificationPage,
  },
]);
