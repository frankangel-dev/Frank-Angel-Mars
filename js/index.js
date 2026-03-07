// --- Menu Toggle ---
const hamburger = document.getElementById('hamburger-btn');
const nav = document.getElementById('main-nav');
const menuText = hamburger.querySelector('.menu-text');

// toggle() returns true/false so I'm using that as isActive directly
hamburger.addEventListener('click', () => {
    const isActive = hamburger.classList.toggle('active');
    nav.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isActive);

    // swap label based on open/closed state
    menuText.textContent = isActive ? 'CLOSE' : 'MENU';
});

// close menu when any nav link is clicked so it doesn't stay open
nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        menuText.textContent = 'MENU';
    });
});


// --- Theme Toggle ---
const html = document.documentElement; // targeting <html> lets CSS theme the whole page
const themeToggleBtn = document.getElementById('theme-toggle');

// flip icon based on which mode we're switching into
themeToggleBtn.addEventListener('click', () => {
    html.classList.toggle('light-mode');
    const isLightMode = html.classList.contains('light-mode');

    themeToggleBtn.textContent = isLightMode ? '🌙' : '☀️';
    themeToggleBtn.setAttribute('aria-label', isLightMode ? 'Switch to dark mode' : 'Switch to light mode');
});


// --- Footer ---
const footer = document.createElement('footer');
const copyright = document.createElement('p');
const thisYear = new Date().getFullYear(); // pulls current year automatically
const copyrightSymbol = '\u00A9'; // © symbol

copyright.textContent = `${copyrightSymbol} Frank Angel ${thisYear}`;
footer.appendChild(copyright);
document.body.appendChild(footer);


// --- Skills List ---
// easier to update skills here than digging into the HTML
const skills = [
    'JavaScript', 'HTML & CSS', 'C# & .NET', 'Python', 'SQL & MySQL',
    'Git & GitHub', 'AWS (Cloud Foundations)', 'Agile/Scrum',
    'UI/UX Design', 'REST APIs', 'QA Testing', 'Photoshop', 'Figma'
];

const skillsSection = document.getElementById('skills');

if (skillsSection) {
    const skillsList = skillsSection.querySelector('ul');

    if (skillsList) {
        for (let skillName of skills) {
            const skill = document.createElement('li');
            skill.textContent = skillName;
            skillsList.appendChild(skill);
        }
    }
}


// --- Message Form ---
const messageForm = document.querySelector('form[name="leave_message"]');
const messageSection = document.getElementById('messages');
const messageList = messageSection.querySelector('ul');
const emailError = document.getElementById('email-error');

// hide the messages section if there's nothing in it
function updateMessageVisibility() {
    if (messageList.children.length === 0) {
        messageSection.style.display = 'none';
    } else {
        messageSection.style.display = 'block';
    }
}

updateMessageVisibility(); // run once on load

// fires while the user types — flags the field if they clear it out
function validateEditInput(e) {
    const inputField = e.target;
    const newMessage = inputField.closest('li');
    let editError = newMessage.querySelector('.edit-msg');

    if (inputField.value.trim() === '') {
        inputField.setAttribute('aria-invalid', 'true');
        if (!editError) {
            // only create the error element once
            editError = document.createElement('span');
            editError.classList.add('edit-msg');
            editError.textContent = 'Cannot save if empty.';
            inputField.insertAdjacentElement('afterend', editError);
        }
    } else {
        inputField.removeAttribute('aria-invalid');
        if (editError) editError.remove();
    }
}

messageForm.addEventListener('submit', e => {
    e.preventDefault(); // stop the page from refreshing

    const name = e.target.usersName.value;
    const email = e.target.usersEmail.value;
    const message = e.target.usersMessage.value;

    // basic check for something@something.something — not perfect but good enough
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        emailError.textContent = "Please enter a valid email address.";
        e.target.usersEmail.setAttribute('aria-invalid', 'true');
        return;
    } else {
        emailError.textContent = "";
        e.target.usersEmail.removeAttribute('aria-invalid');
    }

    const newMessage = document.createElement('li');

    // clicking the name opens an email to them
    const anchor = document.createElement('a');
    anchor.href = `mailto:${email}`;
    anchor.textContent = name.toUpperCase();

    const messageText = document.createElement('span');
    messageText.textContent = message;

    newMessage.appendChild(anchor);
    newMessage.appendChild(messageText);


    // --- Message Controls ---
    const removeButton = document.createElement('button');
    removeButton.classList.add('btn-remove');
    removeButton.textContent = 'Remove';
    removeButton.type = 'button'; // type="button" so it doesn't trigger form submit
    removeButton.addEventListener('click', () => {
        newMessage.remove();
        updateMessageVisibility();
    });

    const editButton = document.createElement('button');
    editButton.classList.add('btn-edit');
    editButton.textContent = 'Edit';
    editButton.type = 'button';
    editButton.dataset.mode = 'Edit'; // using data-mode to track edit vs save state

    editButton.addEventListener('click', e => {
        const button = e.target;

        if (button.dataset.mode === 'Edit') {
            // swap the span out for an input field
            const messageSpan = newMessage.querySelector('span');
            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.value = messageSpan.textContent;
            inputField.setAttribute('aria-label', 'Edit your message');
            newMessage.insertBefore(inputField, messageSpan);
            messageSpan.remove();

            button.textContent = 'Save';
            button.dataset.mode = 'Save';

            inputField.addEventListener('input', validateEditInput);

        } else if (button.dataset.mode === 'Save') {
            const input = newMessage.querySelector('input');
            const text = input.value.trim();

            // don't save if it's blank
            if (text !== "") {
                const newSpan = document.createElement('span');
                newSpan.textContent = text;
                newMessage.insertBefore(newSpan, input);
                input.remove();

                const editError = newMessage.querySelector('.edit-msg');
                if (editError) editError.remove();

                button.textContent = 'Edit';
                button.dataset.mode = 'Edit';
            }
        }
    });

    // wrap buttons in a div for styling
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('btn-container');
    buttonContainer.appendChild(removeButton);
    buttonContainer.appendChild(editButton);

    newMessage.appendChild(buttonContainer);
    messageList.appendChild(newMessage);

    updateMessageVisibility();
    e.target.reset(); // clear the form after submit
});


// --- GitHub Repos ---
async function loadGitHubRepos() {
    try {
        const response = await fetch('https://api.github.com/users/frankangel-dev/repos');

        if (!response.ok) {
            handleRepoError(new Error(`Failed to fetch GitHub repositories: ${response.status}`));
            return;
        }

        const repositories = await response.json();
        populateProjects(repositories);
    } catch (error) {
        handleRepoError(error);
    }
}

// show a friendly message if the fetch fails, log the real error for debugging
function handleRepoError(error) {
    console.error(error);
    const projectSection = document.getElementById('projects');

    if (projectSection) {
        const errorMsg = document.createElement('p');
        errorMsg.setAttribute('role', 'alert');
        errorMsg.textContent = 'Unable To Load GitHub Repositories. Please Try Again Later.';
        projectSection.appendChild(errorMsg);
    }
}

function populateProjects(repositories) {
    const projectSection = document.getElementById('projects');

    if (projectSection) {
        const projectList = projectSection.querySelector('ul');

        if (projectList) {
            for (const repo of repositories) {
                const project = document.createElement('li');
                const link = document.createElement('a');
                link.href = repo.html_url;
                link.target = "_blank";
                link.rel = "noopener noreferrer"; // security best practice for external links
                link.textContent = repo.name;
                link.setAttribute('aria-label', `Visit ${repo.name} repository`);

                project.appendChild(link);
                projectList.appendChild(project);
            }
        }
    }
}

loadGitHubRepos();
