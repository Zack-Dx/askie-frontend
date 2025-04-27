import { FileQuestionIcon, HomeIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const ErrorBoundary = () => {
  return (
    <div className="bg-white flex min-h-[100vh] w-full flex-col items-center justify-center p-4 text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted">
        <FileQuestionIcon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h1 className="mt-6 text-4xl font-bold tracking-tight text-primary">
        404
      </h1>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">
        Page Not Found
      </h2>
      <p className="mt-4 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button
        className="mt-8 bg-destructive hover:bg-destructive-hover"
        asChild
      >
        <Link to="/">
          <HomeIcon className="mr-2 h-4 w-4" />
          Back to home
        </Link>
      </Button>
    </div>
  );
};

export default ErrorBoundary;
