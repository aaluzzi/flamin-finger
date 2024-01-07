import { HOST } from '../script.js';

export async function loadLeaderboard() {
	document.querySelector('.scores').innerHTML = 'Fetching scores..';
	document.querySelector('.scores').classList.remove('hidden');
    document.querySelector('.score').classList.add('hidden');
	document.querySelector('.game').classList.add('hidden');

	try {
		const resp = await fetch(`${HOST}/api/scores`, {
			method: 'GET',
		});
		const json = await resp.json();
		displayScores(json);
	} catch (err) {
		document.querySelector('.scores').innerHTML = 'Failed to fetch';
	}
	
}

export function hideLeaderboard() {
    document.querySelector('.scores').classList.add('hidden');
	document.querySelector('.score').classList.remove('hidden');
	document.querySelector('.game').classList.remove('hidden');
}

function displayScores(users) {
	const table = document.createElement('table');

	// Create table header
	const thead = document.createElement('thead');

	const headerRow = document.createElement('tr');
    headerRow.appendChild(getTableHeader('Ranking'));
    headerRow.appendChild(getTableHeader('Username'));
    headerRow.appendChild(getTableHeader('Score'));
	headerRow.appendChild(getTableHeader('Date'));

	thead.appendChild(headerRow);
	table.appendChild(thead);

	// Create table body
	var tbody = document.createElement('tbody');

    users.forEach((user, index) => {
        const row = document.createElement('tr');
    
        row.appendChild(getTableCell(index + 1));
        row.appendChild(getTableCell(user.username));
        row.appendChild(getTableCell(user.highscore));
		row.appendChild(getTableCell(new Date(user.highscoreDate).toLocaleDateString('en-US', 
			{ month: '2-digit', day: '2-digit', year: '2-digit' })));
    
        tbody.appendChild(row);
    });
    	

	table.appendChild(tbody);

    document.querySelector('.scores').innerHTML = '';
	document.querySelector('.scores').appendChild(table);
}

function getTableCell(value) {
    const td = document.createElement('td');
	td.textContent = value;
	return td;
}

function getTableHeader(value) {
    const th = document.createElement('th');
	th.textContent = value;
	return th;
}