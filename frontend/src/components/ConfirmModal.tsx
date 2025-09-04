import React from "react";

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<Props> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
