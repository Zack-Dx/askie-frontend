import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDispatch } from "react-redux";
import axios from "axios";
import { CONFIG } from "@/constants";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon, LoaderCircleIcon, LockIcon } from "lucide-react";
import {
  Form,
  FormField,
  FormControl,
  FormDescription,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { siteConfig } from "@/constants/site";
import { clearUser, setUser } from "@/redux/features/user/userSlice";
import useAuthentication from "@/hooks/useAuthentication";
import { getIpMetadata } from "@/utils";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuthentication();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleOnSubmit = async (values) => {
    setLoading(true);
    try {
      let metadata = {};

      if (import.meta.env.PROD) {
        metadata = await getIpMetadata();
      }
      const response = await axios.post(
        `${CONFIG.BACKEND_API_URL}/signup`,
        { ...values, metadata: { ...metadata, provider: "regular" } },
        { withCredentials: true }
      );
      const user = response.data.data;
      dispatch(setUser(user));
      toast.success(`Welcome! ${user.name}`);
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
      dispatch(clearUser());
    } finally {
      setLoading(false);
    }
  };

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div
      className={`flex items-center justify-center h-screen ${
        loading ? "opacity-80" : "opacity-100"
      }`}
    >
      <Card className="p-6 w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            Sign up to <span className="text-primary">{siteConfig.name}</span>
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details below to create a new account
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)}>
            <CardContent className="grid gap-4">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                rules={{
                  required: "Name is required",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Your Name"
                        aria-label="Your Name"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
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
                        placeholder="you@example.com"
                        aria-label="Email"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
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
                          placeholder="Password"
                          aria-label="Password"
                          disabled={loading}
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
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full relative flex items-center space-x-2 bg-destructive hover:bg-destructive-hover"
                disabled={loading}
                aria-label="Sign up"
              >
                <LockIcon size={16} className="absolute left-0 ml-3" />
                <span>Sign up</span>
                {loading && (
                  <LoaderCircleIcon size={16} className="animate-spin" />
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
        <div className="m-auto mt-2 w-fit">
          <span className="m-auto text-sm">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="font-semibold text-primary"
              aria-label="Sign in to your account"
            >
              Sign in
            </Link>
          </span>
        </div>
      </Card>
    </div>
  );
};

export default Register;
