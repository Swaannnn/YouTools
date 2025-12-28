let settings = {
    removeShorts: false,
    addReducedReader: true,
}

// Charge les paramètres au démarrage
chrome.storage.sync.get(['removeShorts', 'addReducedReader'], (result) => {
    settings.removeShorts = result.removeShorts || false
    settings.addReducedReader = result.addReducedReader || false
    applyModifications()
})

// Écoute les messages du popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleShorts') {
        settings.removeShorts = request.enabled
        applyModifications()
    }
    if (request.action === 'toggleReducedReader') {
        settings.addReducedReader = request.enabled
        applyModifications()
    }
})

// Fonction pour supprimer les Shorts
const removeShorts = () => {
    // Sélecteurs pour différentes sections de Shorts
    const selectors = [
        'ytd-reel-shelf-renderer',
        'ytd-rich-shelf-renderer[is-shorts]',
        '[is-shorts]',
        'ytd-guide-entry-renderer:has([title="Shorts"])',
    ]

    selectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector)
        elements.forEach((el) => {
            if (settings.removeShorts) {
                el.style.display = 'none'
            } else {
                el.style.display = ''
            }
        })
    })
}

// Fonction pour ajouter le bouton du lecteur réduit
const getReducedReader = () => {
    const container = document.querySelector('.ytp-right-controls-left')
    if (!container) return

    // Vérifie si l'élément existe déjà pour éviter les doublons
    const existingButton = container.querySelector('.custom-test-element')

    // Si l'option est désactivée, supprime le bouton s'il existe
    if (!settings.addReducedReader) {
        if (existingButton) {
            existingButton.remove()
        }
        return
    }

    // Si le bouton existe déjà et l'option est activée, on sort
    if (existingButton) return

    const button = document.createElement('button')
    button.className = 'ytp-size-button ytp-button custom-test-element'
    button.setAttribute('aria-keyshortcuts', 'i')
    button.dataset.priority = '9'
    button.dataset.titleNoTooltip = 'Lecteur réduit'
    button.setAttribute('aria-label', 'Lecteur réduit Raccourci clavier i')
    button.setAttribute('data-tooltip-title', 'Lecteur réduit (i)')

    button.addEventListener('click', () => {
        const keyEvent = new KeyboardEvent('keydown', {
            key: 'i',
            code: 'KeyI',
            keyCode: 73,
            which: 73,
            bubbles: true,
            cancelable: true,
            view: window,
        })
        document.dispatchEvent(keyEvent)
    })

    button.innerHTML = `
        <svg height="24" viewBox="0 0 24 24" width="24">
            <path
                d="M21.20 3.01C21.66 3.05 22.08 3.26 22.41 3.58C22.73 3.91 22.94 4.33 22.98 4.79L23 5V19C23.00 19.49 22.81 19.97 22.48 20.34C22.15 20.70 21.69 20.93 21.20 20.99L21 21H3L2.79 20.99C2.30 20.93 1.84 20.70 1.51 20.34C1.18 19.97 .99 19.49 1 19V13H3V19H21V5H11V3H21L21.20 3.01ZM1.29 3.29C1.10 3.48 1.00 3.73 1.00 4C1.00 4.26 1.10 4.51 1.29 4.70L5.58 9H3C2.73 9 2.48 9.10 2.29 9.29C2.10 9.48 2 9.73 2 10C2 10.26 2.10 10.51 2.29 10.70C2.48 10.89 2.73 11 3 11H9V5C9 4.73 8.89 4.48 8.70 4.29C8.51 4.10 8.26 4 8 4C7.73 4 7.48 4.10 7.29 4.29C7.10 4.48 7 4.73 7 5V7.58L2.70 3.29C2.51 3.10 2.26 3.00 2 3.00C1.73 3.00 1.48 3.10 1.29 3.29ZM19.10 11.00L19 11H12L11.89 11.00C11.66 11.02 11.45 11.13 11.29 11.29C11.13 11.45 11.02 11.66 11.00 11.89L11 12V17C10.99 17.24 11.09 17.48 11.25 17.67C11.42 17.85 11.65 17.96 11.89 17.99L12 18H19L19.10 17.99C19.34 17.96 19.57 17.85 19.74 17.67C19.90 17.48 20.00 17.24 20 17V12L19.99 11.89C19.97 11.66 19.87 11.45 19.70 11.29C19.54 11.13 19.33 11.02 19.10 11.00ZM13 16V13H18V16H13Z"
                fill="white"
            ></path>
        </svg>
        `

    container.appendChild(button)
}

// Applique toutes les modifications
const applyModifications = () => {
    removeShorts()
    getReducedReader()
}

// Observer pour détecter les changements dynamiques de YouTube
const observer = new MutationObserver((mutations) => {
    applyModifications()
})

// Commence l'observation
observer.observe(document.body, {
    childList: true,
    subtree: true,
})

// // Observer pour détecter les changements dynamiques de YouTube
// const observer = new MutationObserver((mutations) => {
//     observer.disconnect()
//     applyModifications()
//     observer.observe(document.body, {
//         childList: true,
//         subtree: true,
//     })
// })

// Applique les modifications au chargement initial
window.addEventListener('load', () => {
    applyModifications()
})

// Applique aussi lors des navigations (YouTube est une SPA)
document.addEventListener('yt-navigate-finish', () => {
    applyModifications()
})
