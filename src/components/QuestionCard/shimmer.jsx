import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock } from "lucide-react";

export default function ShimmerQuestionCard() {
  return (
    <Card className="w-full overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md ">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Vote column */}
          <div className="flex flex-col items-center space-y-2 text-sm font-medium">
            <div className="w-6 h-6 bg-primary/20 rounded animate-pulse" />
            <div className="w-8 h-6 bg-primary/20 rounded animate-pulse" />
            <div className="w-6 h-6 bg-primary/20 rounded animate-pulse" />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              {/* <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" /> */}
            </div>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((i) => (
                <Badge
                  key={i}
                  className="bg-blue-100/50 text-transparent animate-pulse"
                >
                  Loading
                </Badge>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1 text-blue-600/50">
                  <MessageSquare size={14} />
                  <div className="w-12 h-4 bg-blue-100 rounded animate-pulse" />
                </span>
                <span className="flex items-center space-x-1 text-orange-600/50">
                  <Clock size={14} />
                  <div className="w-24 h-4 bg-orange-100 rounded animate-pulse" />
                </span>
              </div>
            </div>
          </div>

          {/* User info */}
          <div className="flex flex-col items-center space-y-1 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
            <Badge
              variant="outline"
              className="text-xs px-2 py-0.5 bg-purple-50/50 text-transparent border-purple-300/50 animate-pulse"
            >
              Loading
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
