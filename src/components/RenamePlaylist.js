import "../components.css";
import React, { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); //For accessibility

export default function RenamePlaylist({ playlistName, onRename }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newName, setNewName] = useState(playlistName);

  const openModal = () => {
    setNewName(playlistName); //reset current name
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRename(newName); //Call the handler provided by the parent
    closeModal();
  };

  return (
    <div>
      <button onClick={openModal} title="Rename the selected playlist">
        🖋
      </button>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <h2>Change the name of this playlist</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newName}
            onChange={handleNameChange}
            placeholder="Enter the new name"
            required
          />
          <button type="submit" title="Submit the changes">
            ✅
          </button>
          <button
            type="button"
            onClick={closeModal}
            title="Exit the progress without saving changes"
          >
            ❌
          </button>
        </form>
      </Modal>
    </div>
  );
}
