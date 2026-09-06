import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import CreateTrip from "./create-trip/index.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Viewtrip from "./view-trip/[tripid]/index.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import AiSummary from "./AiSummary/AiSummary.jsx";
import SummaryAndImpacts from "./AiSummary/SummaryAndImpacts.jsx";
import CategoriesInfo from "./AiSummary/CategoriesInfo.jsx";
import TrendingInfo from "./AiSummary/TrendingInfo.jsx";
import AboutUs from "./components/custom/Aboutus.jsx";
import Discussion from "./components/custom/Discussion.jsx";
import ClientDiscussion from "./components/ClientDiscussion.jsx";
import Login from "./components/custom/Login.jsx";
import Register from "./components/custom/Register.jsx";
import { AuthProvider } from "./context/AuthContext";
import { BookmarkProvider } from "./context/BookmarkContext";
import RootLayout from "./components/layout/RootLayout";
import Profile from "./components/custom/Profile";
import Achievements from "./components/custom/Achievements.jsx";
import AiAssistant from "./components/custom/AiAssistant.jsx";
import ReadingList from "./components/custom/ReadingList.jsx";
import Preferences from "./components/custom/Preferences.jsx";
import Analytics from "./components/custom/Analytics.jsx";
import PremiumFeatures from "./components/custom/PremiumFeatures.jsx";
import BookmarksPage from "./components/custom/BookmarksPage.jsx";

//using react-router-dom for creating diff routes on pages
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/dashboard",
        element: <App />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "ai-summary",
        element: <AiSummary />,
      },
      {
        path: "summary-and-impacts",
        element: <SummaryAndImpacts />,
      },
      {
        path: "categories-info",
        element: <CategoriesInfo />,
      },
      {
        path: "trending-info",
        element: <TrendingInfo />,
      },
      {
        path: "view-trip/:tripid",
        element: <Viewtrip />,
      },
      {
        path: "home",
        element: <App />,
      },
      {
        path: "about-us",
        element: <AboutUs />,
      },
      {
        path: "discussions",
        element: <Discussion />,
      },
      {
        path: "article-discussion/:articleId",
        element: <ClientDiscussion />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "achievements",
        element: <Achievements />,
      },
      {
        path: "reading-list",
        element: <ReadingList />
      },
      {
        path: "preferences",
        element: <Preferences />
      },
      {
        path: "analytics",
        element: <Analytics />
      },
      {
        path: "premium",
        element: <PremiumFeatures />
      },
      {
        path: "ai-assistant",
        element: <AiAssistant />
      },
      {
        path: "bookmarks",
        element: <BookmarksPage />
      }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BookmarkProvider>
        <GoogleOAuthProvider
          clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}
        >
          <Toaster />
          <RouterProvider router={router} />
        </GoogleOAuthProvider>
      </BookmarkProvider>
    </AuthProvider>
  </StrictMode>
);
