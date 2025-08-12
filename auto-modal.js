document.addEventListener('DOMContentLoaded', (event) => {
    // Select the modal and close button
    const modal = document.getElementById('menupyModal');
    const closeBtn = modal.querySelector('.close');

    // Show the modal
    modal.style.display = 'flex';
    modal.classList.add('show');

    // Function to close the modal
    const closeModal = () => {
        modal.classList.add('closing');
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('show', 'closing');
        }, 200); // Match animation duration
    };

    // Close the modal when the close button is clicked
    closeBtn.addEventListener('click', closeModal);

    // Close the modal when clicking outside of the modal content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
});