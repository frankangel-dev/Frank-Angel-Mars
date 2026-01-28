// Footer
const body = document.body;
const footer = document.createElement('footer');
const copyright = document.createElement('p');
const today = new Date();
const thisYear = today.getFullYear();
const copyrightSymbol = '\u00A9';

copyright.textContent = `${copyrightSymbol} Frank Angel ${thisYear}`;
footer.appendChild(copyright);
body.appendChild(footer);

const skills = ['JavaScript', 'HTML', 'CSS', 'C#', 'Python', 'GitHub', 'Photoshop', 'Figma'];
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

// Message Form
const messageForm = document.querySelector('form[name="leave_message"]');
const messageSection = document.getElementById('messages');
const messageList = messageSection.querySelector('ul');

if (messageList.children.length === 0) {
    messageSection.style.display = 'none';
}

messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = e.target.usersName.value;
    const email = e.target.usersEmail.value;
    const message = e.target.usersMessage.value;
    const emailSymbol = '\u{1F4E7}';

    messageSection.style.display = 'block';

    const newMessage = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.href = `mailto:${email}`;
    anchor.textContent = `${name.toUpperCase()} ${emailSymbol}`;

    const messageText = document.createElement('span');
    messageText.textContent = message;

    newMessage.appendChild(anchor);
    newMessage.appendChild(messageText);

    const removeButton = document.createElement('button');
    removeButton.classList.add('btn-remove');
    removeButton.textContent = 'Remove';
    removeButton.type = 'button';
    removeButton.addEventListener('click', () => {
        newMessage.remove();

        if (messageList.children.length === 0) {
            messageSection.style.display = 'none';
        }
    });

    const editButton = document.createElement('button');
    editButton.classList.add('btn-edit');
    editButton.textContent = 'Edit';
    editButton.type = 'button';
    editButton.dataset.mode = 'Edit';

    editButton.addEventListener('click', e => {
        const button = e.target;
        const messageSpan = newMessage.querySelector('span');

        if (button.dataset.mode === 'Edit') {
            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.value = messageSpan.textContent;
            newMessage.insertBefore(inputField, messageSpan);
            messageSpan.remove();
            button.textContent = 'Save';
            editButton.dataset.mode = 'Save';
        } else if (button.dataset.mode === 'Save') {
            const input = newMessage.querySelector('input');
            const text = input.value.trim();
            if (text !== "") {
                const newSpan = document.createElement('span');
                newSpan.textContent = text;
                newMessage.insertBefore(newSpan, input);
                input.remove();
                button.textContent = 'Edit';
                button.dataset.mode = 'Edit';
            } else {
                input.style.borderColor = 'red';
            }
        }
    });

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('btn-container');
    buttonContainer.appendChild(removeButton);
    buttonContainer.appendChild(editButton);

    newMessage.appendChild(buttonContainer);

    messageList.appendChild(newMessage);
    
    e.target.reset();
});

// Fetch
async function loadGitHubRepos() {
    try {
        const response = await fetch('https://api.github.com/users/frankangel-dev/repos');

        if (!response.ok) {
            handleRepoError(new Error(`Failed to fetch GitHub repositories: ${response.status}`));
            return;
        }

        const repositories = await response.json();
        console.log(repositories);

        populateProjects(repositories);
    } catch (error) {
        console.error(error);
        handleRepoError(error);
    }
}

function handleRepoError(error) {
    console.error(error);
    const projectSection = document.getElementById('projects');

    if (projectSection) {
        const errorMsg = document.createElement('p');
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
                project.textContent = repo.name;
                
                projectList.appendChild(project);
            }
        }
    }
}

loadGitHubRepos();
