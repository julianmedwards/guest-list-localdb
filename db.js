let db

function initDatabase() {
    window.indexedDB =
        window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB

    window.IDBTransaction =
        window.IDBTransaction ||
        window.webkitIDBTransaction ||
        window.msIDBTransaction

    window.IDBKeyRange =
        window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

    if (!window.indexedDB) {
        window.alert(
            "Your browser doesn't support a stable version of IndexedDB."
        )
    }

    let request = window.indexedDB.open('guests', 1)
    request.onerror = function (event) {
        console.log(event)
        alert("Guest list couldn't be displayed!")
    }

    request.onsuccess = function (event) {
        db = request.result
        console.log('success: ' + db)
        retrieveGuests()
    }

    request.onupgradeneeded = function (event) {
        console.log('Upgrading database.')
        var db = event.target.result
        var objectStore = db.createObjectStore('guest', {keyPath: 'email'})
    }
}

function add() {
    let email = document.querySelector('#email').value
    let fname = document.querySelector('#fname').value
    let lname = document.querySelector('#lname').value
    let notes = document.querySelector('#notes').value

    var request = db
        .transaction(['guest'], 'readwrite')
        .objectStore('guest')
        .add({email: email, fname: fname, lname: lname, notes: notes})

    request.onsuccess = function (event) {
        alert(`${fname} ${lname} has been added to your database.`)
    }

    request.onerror = function (event) {
        alert(
            `Unable to add data\r\n${email} may already be registered in the guest list.`
        )
    }
}

function retrieveGuests() {
    var objectStore = db.transaction(['guest'], 'readonly').objectStore('guest')

    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result
        if (cursor) {
            // Iterate through guests in db.
            // Construct list item with two children: the full name and
            // email. Append to guest list.
            var guestLi = document.createElement('li')
            guestLi.classList.add('guest')
            var guestName = document.createElement('p')
            guestName.innerHTML = `${cursor.value.fname} ${cursor.value.lname}`
            var guestEmail = document.createElement('p')
            guestEmail.innerHTML = cursor.value.email

            let guestList = document.getElementById('guests')
            guestList.append(guestLi)
            guestLi.append(guestName, guestEmail)

            cursor.continue()
        } else {
            console.log('All guests displayed.')
        }
    }
}

initDatabase()
