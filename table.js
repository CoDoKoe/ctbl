/**
 * Funktionen für Tabellen um Werte zu sortieren oder zu filtern
 * 
 * Das sieht schon richtig gut aus, sortieren mit numerischen funktioniert noch nicht
 */

let ctbl = {
    ascendingSymbol: '\u25B2',
    descendingSymbol: '\u25BC',
    timeout: 500,
    /**
     * OnClick Event für die Sortierung
     * @param {object} event Klick Event
     */
    sortWait(event) {
        event.stopPropagation();
        event.preventDefault();

        event.target.style.cursor = 'wait';
        document.body.style.cursor = 'wait';
        setTimeout(() => {
            ctbl.sort(event);
            event.target.style.cursor = 'pointer';
            document.body.style.cursor = 'default';
        }, ctbl.timeout);
    },
    /**
     * Die eigentliche Sortierung erfolget in der Funktin sortTable, hier absteigend oder aufsteigend und anschließendes Markup
     * @param {object} event Click Event
     */
    sort(event) {

        let th = event.target;
        let cellIndex = event.target.cellIndex;
        let table = event.target.closest('table');

        let sort = table.querySelector('thead').querySelectorAll('th')[cellIndex].getAttribute('data-sort') ?? '';

        //Welche Sortierung lag vor, dann umkehren
        if (sort == 'az' || sort == '') {
            //absteigend
            sort = 0;
        } else {
            //aufsteigend
            sort = 1;
        }
        //Die eigentliche Sortierung
        ctbl.sortTable(table, cellIndex, sort);

        //makups thead
        table.querySelector('thead').querySelectorAll('th').forEach((th, index) => {

            th.innerHTML = th.textContent.replace(ctbl.ascendingSymbol, '');
            th.innerHTML = th.textContent.replace(ctbl.descendingSymbol, '');
            th.setAttribute('data-sort', 'za');

            if (index == cellIndex) {
                switch (sort) {
                    case 1:
                        //aufsteigent
                        th.setAttribute('data-sort', 'az');
                        th.innerHTML = th.textContent + " " + ctbl.ascendingSymbol;
                        break;
                    case 0:
                        //absteigent
                        th.setAttribute('data-sort', 'za');
                        th.innerHTML = th.textContent + " " + ctbl.descendingSymbol;
                        break;
                }

            }
        });

        th.style.cursor = 'pointer';

    },
    /**
     * Die eigentliche Sortierung der Tabelle
     * @param {object} table Die Tabelle
     * @param {object} col die Spalte
     * @param {integer} asc Sortierung 0 absteigend, 1 aufsteigend
     */
    sortTable: function (table, col, asc) {

        let rows = Array.from(table.querySelectorAll("tbody tr"));
        let dir = asc ? 1 : -1;
        let tBody = table.querySelector("tbody");

        // Sortiere die Zeilen
        rows.sort((a, b) => {

            let aCol = a.querySelectorAll("td")[col].textContent.trim();
            let bCol = b.querySelectorAll("td")[col].textContent.trim();

            if (a.querySelectorAll("td")[col].getAttribute("data-value")) {
                aCol = a.querySelectorAll("td")[col].getAttribute("data-value");
            }
            if (a.querySelectorAll("td")[col].getAttribute("data-value")) {
                bCol = b.querySelectorAll("td")[col].getAttribute("data-value");
            }
            // Konvertiere die Werte in Zahlen für die Sortierung

            return dir * aCol.localeCompare(bCol, "de", { numeric: true });
        });

        // Entferne alle Zeilen aus der Tabelle
        while (tBody.firstChild) {
            tBody.removeChild(tBody.firstChild);
        }

        // Füge die sortierten Zeilen wieder ein
        tBody.append(...rows);
    },
    filter: function (event) {
        event.stopPropagation();
        event.preventDefault();
        let table = event.target.closest('table');
        let col = event.target.cellIndex;
        ctbl.suchListe(table, col);
        ctbl.dialog(table, col);
    },

    suchListe: function (table, col) {
        const spalte = col + 1;
        let liste = [];
        let liste2 = [];
        const tds = table.querySelectorAll(`tbody tr td:nth-child(${spalte})`);
        tds.forEach(el => {
            liste.push(el.textContent);
        })
        liste = [...new Set(liste)].sort((a, b) => a.localeCompare(b, "de", { numeric: true }));

        //prüfen, ob datalist schon vorhanden ist, wenn nein anlegen
        let dataliste = document.querySelector('datalist#suchListe');
        if (!dataliste) {
            dataliste = document.createElement('datalist');
            dataliste.id = "suchListe";
            let body = document.querySelector('body');
            body.appendChild(dataliste);
        }
        //datalist leeren
        dataliste.innerHTML = "";

        //datalist füllen
        liste.forEach((el) => {
            let option = document.createElement('option');
            option.innerHTML = el;
            dataliste.appendChild(option);
        });
    },

    filterTable: function (table, col, filter) {
        console.log(table, col, filter);


        //let filter = "InRechnung";
        let rows = Array.from(table.querySelectorAll("tbody tr"));
        let tBody = table.querySelector("tbody");

        // Filtere die Zeilen
        rows = rows.filter(row => {
            let cell = row.querySelectorAll("td")[col];

            // Volltextsuche
            let searchText = filter.toLowerCase();
            let cellText = cell.textContent.trim().toLowerCase();
            return cellText.includes(searchText);
        });


        // Entferne alle Zeilen aus der Tabelle
        while (tBody.firstChild) {
            tBody.removeChild(tBody.firstChild);
        }

        // Füge die gefilterten Zeilen wieder ein
        tBody.append(...rows);
    },
    dialog: function (table, col) {
        let dialog = document.createElement('dialog');
        dialog.innerHTML = `Filer: <input type="text" id="filter" name="filter" value="" list="suchListe">`;
        dialog.innerHTML += `<button id="filterButton">Filtern</button>`;
        dialog.innerHTML += `<button id="closeButton">Schließen</button>`;
        dialog.querySelector('#filterButton').addEventListener('click', function () {
            ctbl.filterTable(table, col, dialog.querySelector('#filter').value);
            dialog.close();
        });

        dialog.querySelector('#closeButton').addEventListener('click', function () {
            dialog.close();
        });
        dialog.addEventListener('close', function () {
            dialog.remove();
        });

        document.body.appendChild(dialog);
        dialog.showModal();
    }
}