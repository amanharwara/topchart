import Modal from "../components/Modal";
import Toggle from "../components/Toggle";
import {
  useDarkMode,
  useIsSettingsModalOpen,
  useSetDarkMode,
  useSetSettingsModalOpen,
} from "../stores/settings";

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
      <div className="p-4">
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
    </Modal>
  );
};

export default SettingsModal;
