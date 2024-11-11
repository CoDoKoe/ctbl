/**
 * Funktionen für Tabellen um Werte zu sortieren oder zu filtern
 * 
 * Das sieht schon richtig gut aus, sortieren mit numerischen funktioniert noch nicht
 */

let ctbl = {
    ascendingSymbol: '\u25B2',
    descendingSymbol: '\u25BC',
    sortWait(event) {

        event.target.style.cursor = 'wait';
        document.body.style.cursor = 'wait';
        setTimeout(() => {
            ctbl.sort(event);
            event.target.style.cursor = 'pointer';
            document.body.style.cursor = 'default';
        }, 1000);
    },
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
    filterTable: function (table, col, filter) {
        let rows = Array.from(table.querySelectorAll("tbody tr"));
        let tBody = table.querySelector("tbody");

        // Filtere die Zeilen
        rows = rows.filter(row => {
            let cell = row.querySelectorAll("td")[col];
            return cell.textContent.trim().toLowerCase().includes(filter.toLowerCase());
        });


        // Entferne alle Zeilen aus der Tabelle
        while (tBody.firstChild) {
            tBody.removeChild(tBody.firstChild);
        }

        // Füge die gefilterten Zeilen wieder ein
        tBody.append(...rows);
    }
}