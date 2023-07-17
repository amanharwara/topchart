import Button from "../components/Button";
import Modal from "../components/Modal";
import Toggle from "../components/Toggle";
import SpotifyIcon from "../icons/SpotifyIcon";
import UserIcon from "../icons/UserIcon";
import {
  useDarkMode,
  useIsSettingsModalOpen,
  useSetDarkMode,
  useSetSettingsModalOpen,
} from "../stores/settings";
import { spotifyLogIn, spotifyLogOut, getSpotifyUser } from "../stores/spotify";

const SpotifySettings = () => {
  const user = getSpotifyUser();

  return (
    <div className="p-4 pt-2.5">
      <div className="flex flex-col gap-2.5">
        <div className="text-sm font-bold">Spotify Account</div>
        {!user ? (
          <Button onClick={spotifyLogIn} icon={SpotifyIcon}>
            Log in to Spotify
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            {user.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="w-8 h-8 rounded-full"
                src={user.images[0].url}
                alt={user.display_name || user.id}
              />
            ) : (
              <UserIcon className="h-8 w-8 dark:text-slate-300 text-slate-600" />
            )}
            <div className="flex flex-col">
              <div className="text-sm font-bold">
                {user.display_name || user.id}
              </div>
              {user.display_name && (
                <div className="text-xs dark:text-gray-400 text-gray-600">
                  {user.id}
                </div>
              )}
            </div>
            <Button className="ml-auto" onClick={spotifyLogOut}>
              Log out
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const SettingsModal = () => {
  const isSettingsModalOpen = useIsSettingsModalOpen();
  const setSettingsModalOpen = useSetSettingsModalOpen();

  const darkMode = useDarkMode();
  const setDarkMode = useSetDarkMode();

  return (
    <Modal
      title="Settings"
      isOpen={isSettingsModalOpen}
      setOpen={setSettingsModalOpen}
    >
      <div className="p-4 pb-2.5">
        <label className="flex items-center gap-2 justify-between cursor-pointer">
          <div className="flex flex-col">
            <div className="text-sm font-bold">Dark Mode</div>
            <div className="text-xs dark:text-gray-400 text-gray-600">
              Toggle dark mode
            </div>
          </div>
          <Toggle value={darkMode} onChange={setDarkMode} />
        </label>
      </div>
      <SpotifySettings />
    </Modal>
  );
};

export default SettingsModal;
