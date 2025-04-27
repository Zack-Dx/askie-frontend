import { Button } from "@/components/ui/button";
import { Icons } from "@/components/Icons";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/constants/site";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import axios from "axios";
import { CONFIG } from "@/constants";
import { clearUser, setUser } from "@/redux/features/user/userSlice";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon, LoaderCircleIcon, LockIcon } from "lucide-react";
import {
  Form,
  FormField,
  FormControl,
  FormMessage,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import useAuthentication from "@/hooks/useAuthentication";
import { getIpMetadata } from "@/utils";

// GitHub login redirect
const githubLogin = () => {
  window.location.assign(
    `https://github.com/login/oauth/authorize?client_id=${CONFIG.GITHUB_CLIENT_ID}&scope=read:user user:email`
  );
};

const Login = () => {
  const [signInLoading, setSignInLoading] = useState(false);
  const [googleSignInLoading, setGoogleSignInLoading] = useState(false);
  const [githubSignInLoading, setGithubSignInLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const githubCode = searchParams.get("code");
  const { user } = useAuthentication();

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  const handleOnSubmitCredentials = async (values) => {
    setSignInLoading(true);

    try {
      let metadata = {};

      if (import.meta.env.PROD) {
        metadata = await getIpMetadata();
      }

      const response = await axios.post(
        `${CONFIG.BACKEND_API_URL}/signin`,
        { ...values, metadata: { ...metadata, provider: "regular" } },
        { withCredentials: true }
      );
      const user = response.data.data;
      dispatch(setUser(user));
      toast.success(`Welcome! ${user.name}`);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
      dispatch(clearUser());
    } finally {
      setSignInLoading(false);
    }
  };

  // Password Visibility
  const handleShowPassword = () => setShowPassword((prev) => !prev);

  // Google sign-in
  const googleSignInSuccess = async (tokenResponse) => {
    setGoogleSignInLoading(true);
    const access_token = tokenResponse.access_token;
    try {
      let metadata = {};

      if (import.meta.env.PROD) {
        metadata = await getIpMetadata();
      }

      const response = await axios.post(
        `${CONFIG.BACKEND_API_URL}/signin/google`,
        { token: access_token, metadata: { ...metadata, provider: "google" } },
        { withCredentials: true }
      );
      const user = response.data.data;
      dispatch(setUser(user));
      toast.success(`Welcome! ${user.name}`);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
      dispatch(clearUser());
    } finally {
      setGoogleSignInLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: googleSignInSuccess,
    onError: () => {
      toast.error("Oops! Failed to sign in, Please try again later");
      dispatch(clearUser());
    },
  });

  useEffect(() => {
    if (githubCode) {
      const signInWithGithub = async () => {
        setGithubSignInLoading(true);
        try {
          let metadata = {};

          if (import.meta.env.PROD) {
            metadata = await getIpMetadata();
          }

          const response = await axios.post(
            `${CONFIG.BACKEND_API_URL}/signin/github`,
            { code: githubCode, metadata: { ...metadata, provider: "github" } },
            { withCredentials: true }
          );
          const user = response.data.data;
          dispatch(setUser(user));
          toast.success(`Welcome! ${user.name}`);
        } catch (error) {
          const errorMessage =
            error.response?.data?.message ||
            "Something went wrong. Please try again.";
          toast.error(errorMessage);
          dispatch(clearUser());
        } finally {
          setGithubSignInLoading(false);
        }
      };
      signInWithGithub();
    }
  }, [githubCode]);

  return (
    <div
      className={`flex items-center justify-center h-screen container mx-auto ${
        signInLoading || googleSignInLoading || githubSignInLoading
          ? "opacity-80"
          : "opacity-100"
      }`}
    >
      <Card className="p-6 w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">
            Sign in to <span className="text-primary">{siteConfig.name}</span>
          </CardTitle>
          <CardDescription>
            {/* Enter your credentials to log into your account */}
            Where Developers Ask, Share & Thrive
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmitCredentials)}>
            <CardContent className="grid gap-4">
              {/* Social logins */}
              <div className="grid grid-cols-2 gap-6">
                <Button
                  type="button"
                  variant="outline"
                  disabled={
                    signInLoading || googleSignInLoading || githubSignInLoading
                  }
                  onClick={githubLogin}
                  aria-label="Login with GitHub"
                >
                  <Icons.gitHub className="mr-2 h-4 w-4" />
                  Github
                  {githubSignInLoading && (
                    <LoaderCircleIcon className="animate-spin ml-2" />
                  )}
                </Button>
                <Button
                  type="button"
                  disabled={
                    signInLoading || googleSignInLoading || githubSignInLoading
                  }
                  variant="outline"
                  onClick={googleLogin}
                  aria-label="Login with Google"
                >
                  <Icons.google className="mr-2 h-4 w-4" />
                  Google
                  {googleSignInLoading && (
                    <LoaderCircleIcon className="animate-spin ml-2" />
                  )}
                </Button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Email & Password Fields */}
              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: "Email is required",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="m@example.com"
                        aria-label="Email"
                        disabled={
                          signInLoading ||
                          googleSignInLoading ||
                          githubSignInLoading
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                rules={{
                  required: "Password is required",
                }}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          aria-label="Password"
                          disabled={
                            signInLoading ||
                            googleSignInLoading ||
                            githubSignInLoading
                          }
                        />
                        <div
                          className="absolute right-0 top-3 mr-3 cursor-pointer"
                          onClick={handleShowPassword}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOffIcon size={16} />
                          ) : (
                            <EyeIcon size={16} />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            {/* Submit Button */}
            <CardFooter>
              <Button
                type="submit"
                disabled={
                  signInLoading || googleSignInLoading || githubSignInLoading
                }
                className="w-full relative flex items-center space-x-2 bg-destructive hover:bg-destructive-hover"
                aria-label="Sign in"
              >
                <LockIcon size={16} className="absolute left-0 ml-3" />
                <span>Sign in</span>
                {signInLoading && (
                  <LoaderCircleIcon className="animate-spin ml-2" />
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>

        {/* Forgot Password & Signup */}
        <div className="flex justify-between mt-4">
          {/* <div
            onClick={() => {
              toast.info("Forgot password is currently under maintenance.");
            }}
            className="text-sm font-medium hover:underline cursor-pointer"
            aria-label="Reset your password"
          >
            Forgot your password?
          </div> */}
          <div
            onClick={() => {
              form.setValue("email", CONFIG.TEST_USER_EMAIL);
              form.setValue("password", CONFIG.TEST_USER_PASSWORD);
            }}
            className="text-sm font-medium hover:underline animate-pulse cursor-pointer"
            aria-label="Reset your password"
          >
            Use Demo credentials
          </div>

          <Link
            to="/register"
            className="text-sm font-medium hover:underline"
            aria-label="Create new account"
          >
            Create an account
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
