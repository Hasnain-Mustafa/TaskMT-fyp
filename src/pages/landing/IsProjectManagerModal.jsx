import Backdrop from "../../components/Backdrop";

const IsProjectManagerModal = ({
  setIsProjectManager,
  setShowProjectManagerModal,
}) => {
  return (
    <Backdrop onClick={() => setShowProjectManagerModal(false)}>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-8 shadow-md">
        <h3 className="text-lg font-semibold mb-4">Select Your Role</h3>
        <button
          onClick={() => {
            setIsProjectManager(true);
            setShowProjectManagerModal(false);
          }}
          className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-md mb-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Project Manager
        </button>
        <button
          onClick={() => {
            setIsProjectManager(false);
            setShowProjectManagerModal(false);
          }}
          className="w-full bg-gray-500 text-white font-medium py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Developer
        </button>
      </div>
    </Backdrop>
  );
};

export default IsProjectManagerModal;
