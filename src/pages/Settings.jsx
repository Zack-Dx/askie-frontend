import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CONFIG } from "@/constants";
import {
  clearUser,
  setUser,
  updateUser,
} from "@/redux/features/user/userSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import useAuthentication from "@/hooks/useAuthentication";
import { LoaderCircleIcon, SparklesIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { daysRemainingCalculator } from "@/utils";

const Settings = () => {
  const dispatch = useDispatch();
  const { user } = useAuthentication();
  const [profilePictureUpdating, setProfilePictureUpdating] = useState(false);
  const [profileUpdating, setProfileUpdating] = useState(false);
  const filePickerRef = useRef(null);
  const form = useForm({
    defaultValues: {
      name: user.name,
      profession: user.profession,
      about: user.about,
      githubUrl: user.githubUrl,
      linkedinUrl: user.linkedinUrl,
      portfolioUrl: user.portfolioUrl,
      twitterUrl: user.twitterUrl,
      location: user.location,
      isPublic: user.isPublic,
    },
  });

  const handleOnSubmitInformation = async (values) => {
    setProfileUpdating(true);
    try {
      const response = await axios.patch(
        `${CONFIG.BACKEND_API_URL}/profile`,
        values,
        { withCredentials: true }
      );
      const user = response.data.data;
      dispatch(setUser(user));
      toast.success("Profile updated successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
      dispatch(clearUser());
    } finally {
      setProfileUpdating(false);
    }
  };

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      toast.error("File size should be less than 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("picture", file);
    setProfilePictureUpdating(true);
    try {
      const response = await axios.patch(
        `${CONFIG.BACKEND_API_URL}/profile/picture`,
        formData,
        {
          withCredentials: true,
        }
      );
      const picture = response.data.data.picture;
      dispatch(setUser({ ...user, picture }));
      toast.success("Profile picture updated successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setProfilePictureUpdating(false);
    }
  };

  const handleProfileVisibilityChange = async (value) => {
    const payload = { isPublic: value };
    try {
      const response = await axios.patch(
        `${CONFIG.BACKEND_API_URL}/profile`,
        payload,
        {
          withCredentials: true,
        }
      );
      const updatedUser = response.data.data;
      dispatch(updateUser(updatedUser));
      toast.success(
        `Visibility updated to ${updatedUser.isPublic ? "Public" : "Private"}`
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-full bg-white">
      <div className="w-full px-8 py-8">
        <h2 className="text-3xl tracking-tighter font-semibold">
          Account Settings
        </h2>
        <div className="flex md:flex-row flex-col md:justify-between">
          <p className="my-4 text-gray-500 text-sm">
            Manage your user account settings here.
          </p>
          {user?.isPremium && (
            <div className="flex items-center space-x-2 p-3 border rounded-lg border-rose-200 bg-rose-50 dark:border-rose-900/70 dark:bg-rose-950/30">
              <SparklesIcon className="text-rose-500 h-5 w-5" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Pro expires in{" "}
                <span className="font-semibold text-rose-600 dark:text-rose-400">
                  {daysRemainingCalculator(user.premiumEndDate)}{" "}
                  {daysRemainingCalculator(user.premiumEndDate) === 1
                    ? "day"
                    : "days"}
                </span>
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 py-6">
          <Switch
            onCheckedChange={handleProfileVisibilityChange}
            id="profile-visibility"
            checked={user.isPublic}
          />
          <Label htmlFor="profile-visibility">Public Profile</Label>
        </div>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg my-6 font-semibold leading-6 text-gray-900">
              Profile Information
            </h3>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleOnSubmitInformation)}
                className="mt-6"
              >
                <div className="space-y-6">
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <FormField
                        control={form.control}
                        name="profession"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Profession</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder=""
                                name="profession"
                                id="profession"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="grid w-full gap-4">
                    <FormField
                      control={form.control}
                      name="about"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>About</FormLabel>
                          <FormControl>
                            <>
                              <Textarea
                                {...field}
                                placeholder="Type your message here."
                                id="about"
                              />
                              <p className="text-sm text-muted-foreground">
                                Write a few sentences about yourself.
                              </p>
                            </>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Label>Profile Photo</Label>

                    <div className="flex mt-1 items-center">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          className="rounded-full"
                          src={user.picture}
                          alt={user.name}
                        />
                        <AvatarFallback>{user.name.at(0)}</AvatarFallback>
                      </Avatar>

                      <Label className="ml-3">
                        <Button
                          type="button"
                          onClick={() => {
                            if (filePickerRef.current) {
                              filePickerRef.current.click();
                            }
                          }}
                          className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          variant="outline"
                          disabled={profilePictureUpdating}
                        >
                          {!profilePictureUpdating ? "Change" : "Uploading..."}
                        </Button>
                        <Input
                          ref={filePickerRef}
                          type="file"
                          id="picture"
                          accept="image/*"
                          className="hidden"
                          onChange={handleProfilePictureChange}
                        />
                      </Label>
                    </div>
                  </div>
                  <hr />
                  <div>
                    <div>
                      <h3 className="text-lg font-semibold leading-6 text-gray-900">
                        Social Media Links
                      </h3>
                      <p className="text-sm mt-1 text-gray-500">
                        Links added here will be reflected on your profile page.
                      </p>
                    </div>
                    <div>
                      <div className="my-4 flex gap-6">
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name="githubUrl"
                            render={({ field }) => {
                              return (
                                <FormItem>
                                  <FormLabel>Github</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <div className="absolute left-0 top-2.5 pl-3">
                                        <Icons.gitHub className="h-5 w-5 text-gray-400" />
                                      </div>
                                      <Input
                                        placeholder="Github profile URL"
                                        className="px-10"
                                        {...field}
                                        type="text"
                                        id="githubUrl"
                                      />
                                    </div>
                                  </FormControl>
                                </FormItem>
                              );
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name="linkedinUrl"
                            render={({ field }) => {
                              return (
                                <FormItem>
                                  <FormLabel>Linkedin</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <div className="absolute left-0 top-2.5 pl-3">
                                        <Icons.linkedin className="h-5 w-5 text-gray-400" />
                                      </div>
                                      <Input
                                        placeholder="Linkedin profile URL"
                                        className="px-10"
                                        {...field}
                                        type="text"
                                        id="linkedinUrl"
                                      />
                                    </div>
                                  </FormControl>
                                </FormItem>
                              );
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex gap-6">
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name="portfolioUrl"
                            render={({ field }) => {
                              return (
                                <FormItem>
                                  <FormLabel>Portfolio</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <div className="absolute left-0 top-2.5 pl-3">
                                        <Icons.portfolio className="h-5 w-5 text-gray-400" />
                                      </div>
                                      <Input
                                        placeholder="Your portfolio URL"
                                        className="px-10"
                                        {...field}
                                        type="text"
                                        id="portfolioUrl"
                                      />
                                    </div>
                                  </FormControl>
                                </FormItem>
                              );
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name="twitterUrl"
                            render={({ field }) => {
                              return (
                                <FormItem>
                                  <FormLabel>Twitter</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <div className="absolute left-0 top-2.5 pl-3">
                                        <Icons.twitter className="h-5 w-5 text-gray-400" />
                                      </div>
                                      <Input
                                        placeholder="Twitter profile URL"
                                        className="px-10"
                                        {...field}
                                        type="text"
                                        id="twitterUrl"
                                      />
                                    </div>
                                  </FormControl>
                                </FormItem>
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <Button
                      type="submit"
                      disabled={profileUpdating}
                      className="bg-destructive hover:bg-destructive-hover"
                    >
                      <div className="flex items-center space-x-2">
                        {profileUpdating ? (
                          <>
                            <span>Saving</span>
                            <LoaderCircleIcon className="animate-spin ml-2" />
                          </>
                        ) : (
                          <span>Save Changes</span>
                        )}
                      </div>
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
