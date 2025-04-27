/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import RequireAuth from "@/components/RequireAuth";
import Body from "@/Body";
import Loader from "@/components/Loader";
import ErrorBoundary from "@/components/ErrorBoundary";

const Login = lazy(() => import("@/pages/Login"));
const Home = lazy(() => import("@/pages/Home"));
const Settings = lazy(() => import("@/pages/Settings"));
const Register = lazy(() => import("@/pages/Register"));
const Questions = lazy(() => import("@/pages/Questions"));
const QuestionView = lazy(() => import("@/pages/QuestionView"));
const PremiumSuccess = lazy(() => import("@/pages/PremiumSuccess"));
const Askie = lazy(() => import("@/pages/Askie"));

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorBoundary />,
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <RequireAuth>
            <Body />
          </RequireAuth>
        ),
        children: [
          {
            path: "/",
            element: (
              <Suspense fallback={<Loader />}>
                <Home />
              </Suspense>
            ),
          },
          {
            path: "/settings",
            element: (
              <Suspense fallback={<Loader />}>
                <Settings />
              </Suspense>
            ),
          },
          {
            path: "/questions",
            element: (
              <Suspense fallback={<Loader />}>
                <Questions />
              </Suspense>
            ),
          },
          {
            path: "/view/question/:id",
            element: (
              <Suspense fallback={<Loader />}>
                <QuestionView />
              </Suspense>
            ),
          },
          {
            path: "/premium-success",
            element: (
              <Suspense fallback={<Loader />}>
                <PremiumSuccess />
              </Suspense>
            ),
          },
          {
            path: "/askie",
            element: (
              <Suspense fallback={<Loader />}>
                <Askie />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={<Loader />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "/register",
        element: (
          <Suspense fallback={<Loader />}>
            <Register />
          </Suspense>
        ),
      },
    ],
  },
]);
