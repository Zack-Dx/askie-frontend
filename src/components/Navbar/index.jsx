import { useDispatch } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import axios from "axios";
import { CONFIG } from "@/constants";
import { clearUser } from "@/redux/features/user/userSlice";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { CheckIcon, InboxIcon, MenuIcon, TrashIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSidebar } from "../ui/sidebar";
import useNotifications from "@/hooks/useNotifications";
import useAuthentication from "@/hooks/useAuthentication";
import { Icons } from "../Icons";
import moment from "moment";
import { Input } from "../ui/input";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const { isAuthenticated, user } = useAuthentication();
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem("recent")) || []
  );
  const [searchSuggestions, setSearchSuggestions] = useState();
  const [searchSuggestionsLoading, setSearchSuggestionsLoading] =
    useState(false);

  const {
    notifications,
    markAllAsRead,
    unReadNotificationsCount,
    markAsRead,
    clearAllNotifications,
  } = useNotifications();

  const signOut = async () => {
    try {
      await axios.post(
        `${CONFIG.BACKEND_API_URL}/signout`,
        {},
        { withCredentials: true }
      );
      dispatch(clearUser());
      toast.success(`Sayonara! ${user.name}`);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
      dispatch(clearUser());
    }
  };

  const markNotiAsRead = (noti, isAnswerRelated) => {
    markAsRead(noti.id);
    if (isAnswerRelated) {
      navigate(noti.href + "?noti=true" + `&answer=${noti.answerId}`);
    } else {
      navigate(noti.href);
    }
    setNotificationPanelOpen(false);
  };

  const fetchSearchSuggestions = async (query) => {
    if (!query) return;
    setSearchSuggestionsLoading(true);
    try {
      const response = await axios.get(
        `${CONFIG.BACKEND_API_URL}/questions/suggestions/search?keyword=${query}`,
        {
          withCredentials: true,
        }
      );
      const { data } = response.data;
      setSearchSuggestions(data);
    } catch (error) {
      console.error("Failed to get suggestions", error);
    } finally {
      setSearchSuggestionsLoading(false);
    }
  };

  const handleRecentSearches = (newSearch) => {
    const key = "recent";

    const data = JSON.parse(localStorage.getItem(key)) || [];

    const updatedData = [
      newSearch,
      ...data.filter((item) => item.title != newSearch.title),
    ];

    if (updatedData.length > 3) {
      updatedData.pop();
    }

    localStorage.setItem(key, JSON.stringify(updatedData));
    setRecentSearches(updatedData);
  };

  const handleSearchSuggestionClick = (result) => {
    setInputVal("");
    handleRecentSearches(result);
    navigate(`/view/question/${result.id}`);
  };

  const handleRecentSearchClick = (result) => {
    setInputVal("");
    navigate(`/view/question/${result.id}`);
  };

  const timerRef = useRef(null);

  const handleSearchInput = (e) => {
    const query = e.target.value;
    setInputVal(query);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      fetchSearchSuggestions(query);
    }, 500);
  };

  useEffect(() => {
    const validateRecentSearches = async () => {
      const validSearches = [];
      for (const search of recentSearches) {
        try {
          const res = await axios.get(
            `${CONFIG.BACKEND_API_URL}/questions/${search.id}`,
            { withCredentials: true }
          );
          if (res.status === 200) {
            validSearches.push(search);
          }
        } catch (error) {
          console.log("Failed while validating recent searches.", error);
        }
      }

      localStorage.setItem("recent", JSON.stringify(validSearches));
      setRecentSearches(validSearches);
    };

    validateRecentSearches();
  }, []);

  return (
    <>
      <header className="sticky top-0 px-4 py-2 md:rounded-tl-2xl bg-white z-40 flex justify-between md:justify-end items-center border-b">
        <div onClick={toggleSidebar}>
          <MenuIcon size={26} className="md:hidden" />
        </div>

        <div className="mr-auto ml-3 relative w-full max-w-lg">
          <div className="relative group">
            <div className="relative flex items-center">
              <div className="absolute left-3 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 group-focus-within:text-primary"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
              </div>
              <Input
                type="text"
                placeholder="Search anything..."
                value={inputVal}
                onChange={handleSearchInput}
                className="w-full sm:w-72 md:w-96 lg:w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white"
              />
              {inputVal && (
                <Button
                  onClick={() => setInputVal("")}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 bg-transparent hover:bg-transparent"
                >
                  <XIcon size={16} />
                </Button>
              )}
            </div>

            {inputVal.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100">
                <div className="p-2">
                  {recentSearches?.length > 0 && (
                    <div className="text-xs font-medium text-gray-500 px-3 py-1.5">
                      Recent Searches
                    </div>
                  )}
                  {recentSearches?.map((result, index) => (
                    <div
                      key={`recent-${index}`}
                      className="px-3 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleRecentSearchClick(result)}
                    >
                      <div className="text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="12 8 12 12 14 14"></polyline>
                          <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"></path>
                        </svg>
                      </div>
                      <span className="text-sm">{result.title}</span>
                    </div>
                  ))}

                  {searchSuggestions?.length > 0 && (
                    <div className="text-xs font-medium text-gray-500 px-3 py-1.5 mt-2">
                      Suggestions
                    </div>
                  )}
                  {searchSuggestionsLoading
                    ? Array.from({ length: 2 }).map((_, index) => (
                        <div
                          key={`skeleton-${index}`}
                          className="px-3 py-2 rounded-md flex items-center gap-2 transition-colors animate-pulse"
                        >
                          <div className="bg-gray-300 rounded-full w-4 h-4"></div>
                          <div className="bg-gray-200 h-4 w-3/4 rounded-md"></div>
                        </div>
                      ))
                    : searchSuggestions?.map((result) => (
                        <div
                          key={`suggestion-${result?.id}`}
                          className="px-3 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleSearchSuggestionClick(result)}
                        >
                          <div className="text-gray-400">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="11" cy="11" r="8"></circle>
                              <path d="m21 21-4.3-4.3"></path>
                            </svg>
                          </div>
                          <span className="text-sm">{result?.title}</span>
                        </div>
                      ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/*Notification Panel */}
          <DropdownMenu
            open={notificationPanelOpen}
            onOpenChange={(open) => setNotificationPanelOpen(open)}
          >
            <DropdownMenuTrigger asChild>
              <div
                className="relative ml-4"
                role="button"
                aria-label="Toggle Notifications"
              >
                <InboxIcon
                  onClick={() => setNotificationPanelOpen((prev) => !prev)}
                  size={18}
                  className="cursor-pointer"
                />
                {unReadNotificationsCount > 0 && (
                  <div className="absolute -right-2 -top-2 w-full h-full flex justify-center items-center rounded-md bg-destructive/90">
                    <span className="text-[10px] font-bold text-white">
                      {unReadNotificationsCount}
                    </span>
                  </div>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 md:w-96">
              <div>
                <div>
                  <div className="px-3 py-3 flex justify-between border-b items-center">
                    <h3 className="font-semibold">Notifications</h3>
                    <div className="flex items-center space-x-2">
                      {notifications?.length > 0 &&
                        unReadNotificationsCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-primary bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          >
                            <CheckIcon size={14} className="mr-1" />
                            Mark all as read
                          </button>
                        )}
                      {notifications?.length > 0 && (
                        <button
                          onClick={clearAllNotifications}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-primary bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                          <TrashIcon size={14} className="mr-1" />
                          Clear
                        </button>
                      )}
                      <XIcon
                        size={18}
                        onClick={() => {
                          setNotificationPanelOpen(false);
                        }}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
                <div className="h-[360px] overflow-y-auto">
                  {notifications?.length === 0 ? (
                    <div className="h-full w-full flex flex-col items-center justify-center">
                      <img
                        src={"/notification.svg"}
                        alt="no_notification_image"
                        height={100}
                        width={100}
                      />
                      <span className="text-sm text-gray-400 font-medium">
                        No notifications yet
                      </span>
                    </div>
                  ) : (
                    <div>
                      {notifications?.map((noti) => {
                        return (
                          <div
                            onClick={() => {
                              if (noti.answerId) {
                                markNotiAsRead(noti, true);
                                return;
                              }
                              markNotiAsRead(noti, false);
                            }}
                            key={noti.id}
                            className={`border-b px-2 py-3 transition-all duration-300 cursor-pointer flex items-start ${
                              !noti.read
                                ? "bg-blue-50 border-blue-100"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <Icons.notification
                              className={`h-5 w-5 flex-shrink-0 translate-y-1 rounded bg-opacity-10 p-1 dark:bg-opacity-20 ${
                                !noti.read
                                  ? "text-destructive"
                                  : "text-primary bg-muted"
                              }`}
                            />
                            {!noti.read && (
                              <span className="bg-destructive rounded-full w-2 h-2 ml-2 mt-1.5"></span>
                            )}
                            <div className="ml-3 w-full">
                              <p
                                className={`text-sm ${
                                  !noti.read ? "font-semibold" : ""
                                }`}
                              >
                                {noti.content}
                              </p>
                              <span className="text-xs text-gray-500">
                                {moment(noti.createdAt).fromNow()}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Profile Dropdown */}
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative overflow-hidden rounded-full h-9 w-9 ring-1 ring-primary ring-offset-1 focus-visible:ring-1 focus-visible:ring-offset-1"
                >
                  <Avatar className="h-9 w-9 border">
                    <AvatarImage src={user.picture} alt={user.name} />
                    <AvatarFallback>{user.name.at(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center">
                      <p className="text-sm font-medium leading-none mr-1">
                        {user.name}
                      </p>
                      {user.isPremium && <Icons.verified />}
                    </div>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link to={"/settings"}>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;
