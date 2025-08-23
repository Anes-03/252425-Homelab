document.getElementById('support-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const problemType = document.getElementById('problem-type').value;
    const problemDetails = document.getElementById('problem-details').value;

    const mailtoLink = `mailto:?subject=Supportanfrage: ${problemType}&body=Name: ${name}%0AEmail: ${email}%0AArt des Problems: ${problemType}%0A%0ADetails:%0A${problemDetails}`;

    window.location.href = mailtoLink;
});