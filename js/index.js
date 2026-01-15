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