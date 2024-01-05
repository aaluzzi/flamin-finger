import { HOST } from '../script.js';

export async function loadLeaderboard() {
	document.querySelector('.scores').innerHTML = 'Fetching scores..';
	document.querySelector('.scores').classList.remove('hidden');
    document.querySelectorAll('canvas').forEach(c => c.classList.add('hidden'));

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
    document.querySelectorAll('canvas').forEach(c => c.classList.remove('hidden'));
}

function displayScores(users) {
	const table = document.createElement('table');

	// Create table header
	const thead = document.createElement('thead');

	const headerRow = document.createElement('tr');
    headerRow.appendChild(getTableHeader('Ranking'));
    headerRow.appendChild(getTableHeader('Username'));
    headerRow.appendChild(getTableHeader('Score'));

	thead.appendChild(headerRow);
	table.appendChild(thead);

	// Create table body
	var tbody = document.createElement('tbody');

    users.forEach((user, index) => {
        const row = document.createElement('tr');
    
        row.appendChild(getTableCell(index + 1));
        row.appendChild(getTableCell(user.username));
        row.appendChild(getTableCell(user.highscore));
    
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