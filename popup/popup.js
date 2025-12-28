// Charge les paramètres sauvegardés
chrome.storage.sync.get(['removeShorts', 'addReducedReader'], (result) => {
    const shortsToggle = document.getElementById('toggle-shorts')
    const readucedReaderToggle = document.getElementById(
        'toggle-reduced-reader'
    )

    if (result.removeShorts) {
        shortsToggle.classList.add('active')
    }

    if (result.addReducedReader) {
        readucedReaderToggle.classList.add('active')
    }
})

// Toggle pour supprimer les Shorts
document.getElementById('toggle-shorts').addEventListener('click', function () {
    this.classList.toggle('active')
    const isActive = this.classList.contains('active')

    chrome.storage.sync.set({ removeShorts: isActive }, () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'toggleShorts',
                    enabled: isActive,
                })
            }
        })
    })
})

// Toggle pour ajouter le bouton de lecteur réduit
document
    .getElementById('toggle-reduced-reader')
    .addEventListener('click', function () {
        this.classList.toggle('active')
        const isActive = this.classList.contains('active')

        chrome.storage.sync.set({ addReducedReader: isActive }, () => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'toggleReducedReader',
                        enabled: isActive,
                    })
                }
            })
        })
    })
