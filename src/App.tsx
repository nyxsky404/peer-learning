import React, { useEffect, Suspense, useState, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Router, useLocation } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "@/contexts/AuthContext";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import { RoleProvider } from "@/contexts/RoleContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AdminRoute from "@/components/AdminRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProtectedMentorRoute from "@/components/ProtectedMentorRoute";

// Global layout components - rendered on every page, keep static
import Navbar from "./components/Navbar/Navbar";
import Chatbot from "./components/Chatbot/Chatbot";
import StreakBadge from "./components/StreakBadge";
import CookieConsentBanner from "./components/CookieConsentBanner";
import FloatingAI from "./components/FloatingAI";
import MouseSparkles from "./components/MouseSparkles";
import BackToTop from "./components/BackToTop";
import { useAuth } from "@/contexts/useAuth";
import SplashScreen from "./components/SplashScreen";
import ErrorBoundary from "./components/ErrorBoundary";




// Lazy-loaded page & route-specific components (code-split per route)
const LazyRoute = <T extends React.ComponentType<any>>(
  loader: () => Promise<{ default: T }>
) => {
  const Component = React.lazy(loader);

  return function RouteComponent(props: React.ComponentProps<T>) {
    const location = useLocation();

    return (
      <ErrorBoundary key={location.key}>
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#020617]"><div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" /></div>}>
          <Component {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
};

const Landing = LazyRoute(() => import("./pages/Landing"));
const Index = LazyRoute(() => import("./pages/Index"));
const NotFound = LazyRoute(() => import("./pages/NotFound"));
const Dashboard = LazyRoute(() => import("./pages/Dashboard"));
const MentorDashboard = LazyRoute(() => import("./pages/MentorDashboard"));
const LearnerDashboard = LazyRoute(() => import("./pages/LearnerDashboard"));
const Discover = LazyRoute(() => import("./pages/Discover"));
const Sessions = LazyRoute(() => import("./pages/Sessions"));
const Messages = LazyRoute(() => import("./pages/Messages"));
const Chat = LazyRoute(() => import("./pages/Chat"));
const Login = LazyRoute(() => import("./pages/Login"));
const Signup = LazyRoute(() => import("./pages/Signup"));
const Onboarding = LazyRoute(() => import("./pages/Onboarding"));
const Profile = LazyRoute(() => import("./pages/Profile"));
const EditProfile = LazyRoute(() => import("./pages/EditProfile"));
const Notifications = LazyRoute(() => import("./pages/Notifications"));
const Leaderboard = LazyRoute(() => import("./pages/Leaderboard"));
const Admin = LazyRoute(() => import("./pages/Admin"));
const ForgotPassword = LazyRoute(() => import("./pages/ForgotPassword"));
const ResetPassword = LazyRoute(() => import("./pages/ResetPassword"));
const AnonymousDoubts = LazyRoute(() => import("./pages/AnonymousDoubts"));
const AIPage = LazyRoute(() => import("./pages/aipage"));
const ContributorDashboard = LazyRoute(() => import("./pages/ContributorDashboard"));
const BecomeMentor = LazyRoute(() => import("./pages/BecomeMentor"));
const Portfolio = LazyRoute(() => import("./pages/Portfolio"));
const AuthCallback = LazyRoute(() => import("./pages/AuthCallback"));
const PublicPortfolio = LazyRoute(() => import("./pages/PublicPortfolio"));
const ResourceHub = LazyRoute(() => import("@/pages/ResourceHub"));
const StudyRooms = LazyRoute(() => import("./components/StudyRooms"));
const Room = LazyRoute(() => import("./components/Room/Room"));
const Contact = LazyRoute(() => import("./pages/Contact"));
const PrivacyPolicy = LazyRoute(() => import("./pages/privacy"));
const CookiesPolicy = LazyRoute(() => import("./pages/cookies-policy"));
const PeerReviewDashboard = LazyRoute(() => import("./pages/PeerReviewDashboard"));
const SubmitForReview = LazyRoute(() => import("./pages/SubmitForReview"));
const ReviewSubmission = LazyRoute(() => import("./pages/ReviewSubmission"));
const MockInterview = LazyRoute(() => import("./pages/MockInterview"));
const TermsAndConditions = LazyRoute(() => import("./pages/TermsAndConditions"));

const queryClient = new QueryClient();

const WithNav = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      {user && <StreakBadge />}
      {children}
    </>
  );
};

function AppContent() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <>
      <MouseSparkles />
      <CookieConsentBanner />

      <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" replace /> : <WithNav><Index /></WithNav>}
          />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route
            path="/ai"
            element={
              <ProtectedRoute>
                <WithNav>
                  <AIPage />
                </WithNav>
              </ProtectedRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/become-mentor" element={<BecomeMentor />} />
          <Route path="/portfolio/:slug" element={<PublicPortfolio />} />
          <Route path="/contact" element={<WithNav><Contact /></WithNav>} />
          <Route path="/privacy-policy" element={<WithNav><PrivacyPolicy /></WithNav>} />
          <Route path="/cookies-policy" element={<WithNav><CookiesPolicy /></WithNav>} />
           <Route path="/terms-and-conditions" element={<WithNav><TermsAndConditions /></WithNav>} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <WithNav>
                  <Dashboard />
                </WithNav>
              </ProtectedRoute>
            }
          />

          <Route
            path="/mentor-dashboard"
            element={
              <ProtectedMentorRoute>
                <WithNav>
                  <MentorDashboard />
                </WithNav>
              </ProtectedMentorRoute>
            }
          />

          <Route
            path="/learner-dashboard"
            element={
              <ProtectedRoute>
                <WithNav>
                  <LearnerDashboard />
                </WithNav>
              </ProtectedRoute>
            }
          />

          <Route
            path="/rooms"
            element={
              <ProtectedRoute>
                <WithNav>
                  <StudyRooms />
                </WithNav>
              </ProtectedRoute>
            }
          />

          <Route
            path="/rooms/:id"
            element={
              <ProtectedRoute>
                <WithNav>
                  <Room />
                </WithNav>
              </ProtectedRoute>
            }
          />

          <Route
            path="/discover"
            element={
              <ProtectedRoute>
                <WithNav>
                  <Discover />
                </WithNav>
              </ProtectedRoute>
            }
          />

          <Route
            path="/sessions"
            element={
              <ProtectedRoute>
                <WithNav>
                  <Sessions />
                </WithNav>
              </ProtectedRoute>
            }
          />

          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <WithNav>
                  <Messages user={user} />
                </WithNav>
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <WithNav>
                  <Chat />
                </WithNav>
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <WithNav>
                  <Notifications />
                </WithNav>
              </ProtectedRoute>
            }
          />

          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <WithNav>
                  <Leaderboard />
                </WithNav>
              </ProtectedRoute>
            }
          />

          <Route
            path="/resources"
            element={
              <ProtectedRoute>
                <WithNav>
                  <ResourceHub />
                </WithNav>
              </ProtectedRoute>
            }
          />

          <Route
            path="/portfolio"
            element={
              <ProtectedRoute>
                <WithNav>
                  <Portfolio />
                </WithNav>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <WithNav>
                  <Admin />
                </WithNav>
              </AdminRoute>
            }
          />

          <Route
            path="/peer-review"
            element={
              <ProtectedRoute>
                <WithNav>
                  <PeerReviewDashboard />
                </WithNav>
              </ProtectedRoute>
            }
          />
          <Route
            path="/peer-review/new"
            element={
              <ProtectedRoute>
                <WithNav>
                  <SubmitForReview />
                </WithNav>
              </ProtectedRoute>
            }
          />
          <Route
            path="/peer-review/:id"
            element={
              <ProtectedRoute>
                <WithNav>
                  <ReviewSubmission />
                </WithNav>
              </ProtectedRoute>
            }
          />

          <Route
            path="/mock-interview"
            element={
              <ProtectedRoute>
                <WithNav>
                  <MockInterview />
                </WithNav>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/anonymous-doubts"
            element={
              <ProtectedRoute>
                <WithNav>
                  <AnonymousDoubts />
                </WithNav>
              </ProtectedRoute>
            }
          />

          <Route
            path="/contributor-dashboard"
            element={
              <ProtectedRoute>
                <WithNav>
                  <ContributorDashboard />
                </WithNav>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
      </Routes>

      {user && (
        <>
          <Chatbot />
          <FloatingAI />
        </>
      )}

      <BackToTop />  {/* ? ADDED THIS LINE */}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter>
            <CookieConsentProvider>
              <AuthProvider>
                <RoleProvider>
                  <AppContent />
                </RoleProvider>
              </AuthProvider>
            </CookieConsentProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
