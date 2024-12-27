const daySelect = document.getElementById('day');
const monthSelect = document.getElementById('month');
const yearSelect = document.getElementById('year');

for (let i = 1; i <= 31; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    daySelect.appendChild(option);
}

const monthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
];
monthNames.forEach((month, index) => {
    const option = document.createElement('option');
    option.value = index + 1;
    option.textContent = month;
    monthSelect.appendChild(option);
});

const currentYear = new Date().getFullYear();
for (let i = currentYear; i >= 1900; i--) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    yearSelect.appendChild(option);
}

async function fetchFamousPerson(day, month) {
    const famousList = document.getElementById('famous-list');
    const famousSection = document.getElementById('famous-people');

    try {
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/${month}/${day}`);
        const data = await response.json();

        famousList.innerHTML = '';
        famousSection.style.display = 'block';

        if (data.births && data.births.length > 0) {
            const randomPerson = data.births[Math.floor(Math.random() * data.births.length)];

            let personName = randomPerson.pages ? randomPerson.pages[0].titles.display.trim() : 'Unknown Name';
            personName = personName.replace(/<\/?[^>]+(>|$)/g, '');

            let personDescription = randomPerson.text ? randomPerson.text.replace(/<\/?[^>]+(>|$)/g, '') : 'No description available';

            if (personDescription.startsWith(',')) {
                personDescription = personDescription.substring(1).trim();
            }

            const listItem = document.createElement('div');
            listItem.className = 'famous-item';

            listItem.innerHTML = `
                <img src="${randomPerson.pages[0].thumbnail?.source || 'placeholder.jpg'}" alt="${personName}">
                <p><strong>${personName}</strong></p>
                <p>${personDescription}</p>
            `;

            famousList.appendChild(listItem);
        } else {
            famousSection.style.display = 'none';
            alert('No famous people found for this day!');
        }
    } catch (error) {
        console.error('Error fetching famous person data:', error);
        famousSection.style.display = 'none';
    }
}

document.getElementById('calculate').addEventListener('click', () => {
    const day = parseInt(daySelect.value);
    const month = parseInt(monthSelect.value);
    const year = parseInt(yearSelect.value);

    const resultDisplay = document.getElementById('result');
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);

    if (!day || !month || !year || birthDate > today) {
        resultDisplay.textContent = "Ohh you aren't born yet. Try again!";
        return;
    }

    let ageYears = today.getFullYear() - birthDate.getFullYear();
    let ageMonths = today.getMonth() - birthDate.getMonth();
    let ageDays = today.getDate() - birthDate.getDate();

    if (ageMonths < 0) {
        ageMonths += 12;
        ageYears--;
    }

    if (ageDays < 0) {
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        ageDays += lastMonth.getDate();
        ageMonths--;
    }

    const birthDateAtTime = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate(), 0, 0, 0);
    const timeDifference = today - birthDateAtTime;

    let ageHours = Math.floor(timeDifference / (1000 * 60 * 60)) % 24;
    let ageMinutes = Math.floor(timeDifference / (1000 * 60)) % 60;
    let ageSeconds = Math.floor(timeDifference / 1000) % 60;

    const ageContainer = document.createElement('div');
    ageContainer.id = 'age-container';
    ageContainer.innerHTML = `
        You are <span id="years">${ageYears} years</span> old.
        <div id="detailed-age">
            ${ageMonths} months<br>
            ${ageDays} days<br>
            ${ageHours} hours<br>
            ${ageMinutes} minutes<br>
            <span id="dynamic-seconds">${ageSeconds}</span> seconds
        </div>
    `;

    resultDisplay.innerHTML = '';
    resultDisplay.appendChild(ageContainer);

    setInterval(() => {
        const now = new Date();
        const newTimeDifference = now - birthDateAtTime;

        const newAgeSeconds = Math.floor(newTimeDifference / 1000) % 60;
        document.getElementById('dynamic-seconds').textContent = newAgeSeconds;
    }, 1000);

    fetchFamousPerson(day, month);
});
