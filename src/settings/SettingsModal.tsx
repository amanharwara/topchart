import { useState } from "react";
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

const SpotifySettings = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="p-4 pt-2.5">
      <div className="flex flex-col gap-2.5">
        <div className="text-sm font-bold">Spotify Account</div>
        {!isLoggedIn ? (
          <Button onClick={() => setIsLoggedIn(true)} icon={SpotifyIcon}>
            Login to Spotify
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <UserIcon className="h-8 w-8 text-slate-300" />
            <div className="flex flex-col">
              <div className="text-sm font-bold">Aman Harwara</div>
              <div className="text-xs dark:text-gray-400 text-gray-600">
                aman@proton.me
              </div>
            </div>
            <Button onClick={() => setIsLoggedIn(false)} className="ml-auto">
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
