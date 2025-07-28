
document.addEventListener('DOMContentLoaded', () => {
    // Function to open a modal
    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
        }
    };

    // Function to close a modal
    const closeModal = (modal) => {
        modal.classList.add('closing');
        setTimeout(() => {
            modal.classList.remove('show', 'closing');
        }, 200);
    };

    // Event listener for opening modals
    document.querySelectorAll('[data-modal]').forEach(card => {
        card.addEventListener('click', () => {
            const modalId = card.getAttribute('data-modal');
            openModal(modalId);
        });
    });

    // Event listener for closing modals
    document.querySelectorAll('.modal .close').forEach(closeButton => {
        closeButton.addEventListener('click', () => {
            const modal = closeButton.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });

    // Close modal when clicking outside of it
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });
});
