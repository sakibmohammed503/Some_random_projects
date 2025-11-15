// Game state
const gameState = {
    currentScenario: null,
    day: 1,
    health: 100,
    resources: 100,
    security: 100,
    currentSituation: 0,
    survivalScore: 0
};

// Scenario data
const scenarios = {
    zombie: {
        name: "ZOMBIE OUTBREAK",
        situations: [
            {
                title: "OUTBREAK DETECTED",
                description: "Emergency broadcasts confirm the zombie virus has spread to your city. The streets are filled with the infected. You're safe for now in your apartment, but supplies are limited.",
                tip: "TIP: Secure your location before gathering supplies. Noise attracts the infected.",
                choices: [
                    {
                        text: "Fortify your apartment - board up windows and reinforce doors",
                        effects: { health: -5, resources: -10, security: +20 },
                        nextSituation: 1
                    },
                    {
                        text: "Gather supplies from nearby stores - risk exposure for resources",
                        effects: { health: -15, resources: +25, security: -10 },
                        nextSituation: 2
                    },
                    {
                        text: "Evacuate to the countryside - hope for safer areas outside the city",
                        effects: { health: -10, resources: -15, security: +5 },
                        nextSituation: 3
                    }
                ]
            },
            {
                title: "HOME FORTIFICATION",
                description: "You've secured your apartment. The sounds of chaos outside are constant. Your supplies are dwindling but you're relatively safe for now.",
                tip: "TIP: Conserve resources by rationing food and water. Scavenging becomes more dangerous over time.",
                choices: [
                    {
                        text: "Ration supplies strictly - extend your survival time",
                        effects: { health: -5, resources: +10, security: 0 },
                        nextSituation: 4
                    },
                    {
                        text: "Scavenge neighboring apartments - risky but necessary",
                        effects: { health: -20, resources: +15, security: -10 },
                        nextSituation: 5
                    },
                    {
                        text: "Attempt to signal for help - risk attracting unwanted attention",
                        effects: { health: -10, resources: -5, security: -15 },
                        nextSituation: 6
                    }
                ]
            },
            {
                title: "SUPPLY RUN GONE WRONG",
                description: "Your supply run attracted a horde. You barely made it back alive with limited supplies. The infected are now gathering outside your building.",
                tip: "TIP: Always have an escape route and avoid highly populated areas when scavenging.",
                choices: [
                    {
                        text: "Hold your position - wait for the horde to disperse",
                        effects: { health: -10, resources: -10, security: -5 },
                        nextSituation: 7
                    },
                    {
                        text: "Attempt to clear the horde - dangerous but necessary for long-term survival",
                        effects: { health: -25, resources: -5, security: +10 },
                        nextSituation: 8
                    },
                    {
                        text: "Escape through back routes - abandon your current shelter",
                        effects: { health: -15, resources: -20, security: -10 },
                        nextSituation: 9
                    }
                ]
            }
        ]
    },
    solar: {
        name: "SOLAR FLARE",
        situations: [
            {
                title: "ELECTROMAGNETIC PULSE",
                description: "A massive solar flare has knocked out all electronics worldwide. No power, no communications, no modern transportation. Society has collapsed in an instant.",
                tip: "TIP: Without modern technology, basic survival skills become critical. Water purification and manual tools are essential.",
                choices: [
                    {
                        text: "Secure your home - gather manual tools and non-perishable food",
                        effects: { health: 0, resources: +15, security: +10 },
                        nextSituation: 1
                    },
                    {
                        text: "Head to a community shelter - strength in numbers",
                        effects: { health: -5, resources: -10, security: +15 },
                        nextSituation: 2
                    },
                    {
                        text: "Travel to rural areas - avoid the chaos in population centers",
                        effects: { health: -10, resources: -20, security: +5 },
                        nextSituation: 3
                    }
                ]
            }
        ]
    },
    pandemic: {
        name: "PANDEMIC 2.0",
        situations: [
            {
                title: "OUTBREAK CONFIRMED",
                description: "A new airborne pathogen with 60% mortality rate is spreading globally. Hospitals are overwhelmed. Governments are implementing strict quarantine measures.",
                tip: "TIP: Isolation and hygiene are your best defenses. Stockpile medical supplies and non-perishable food.",
                choices: [
                    {
                        text: "Complete home isolation - minimize all external contact",
                        effects: { health: +10, resources: -15, security: +10 },
                        nextSituation: 1
                    },
                    {
                        text: "Join a quarantine community - shared resources but higher exposure risk",
                        effects: { health: -15, resources: +10, security: +5 },
                        nextSituation: 2
                    },
                    {
                        text: "Continue essential activities with protection - balance risk and necessity",
                        effects: { health: -10, resources: 0, security: 0 },
                        nextSituation: 3
                    }
                ]
            }
        ]
    },
    ai: {
        name: "AI UPRISING",
        situations: [
            {
                title: "SYSTEMS HIJACKED",
                description: "Artificial intelligence has become self-aware and hostile. Automated systems are turning against humanity. Drones, vehicles, and infrastructure are now threats.",
                tip: "TIP: Avoid electronic devices and automated systems. EMP weapons may be effective but are hard to find.",
                choices: [
                    {
                        text: "Go completely analog - abandon all technology",
                        effects: { health: -5, resources: -20, security: +15 },
                        nextSituation: 1
                    },
                    {
                        text: "Find and use EMP devices - fight back against the machines",
                        effects: { health: -15, resources: -10, security: +20 },
                        nextSituation: 2
                    },
                    {
                        text: "Hide in underground locations - avoid detection entirely",
                        effects: { health: -10, resources: -15, security: +10 },
                        nextSituation: 3
                    }
                ]
            }
        ]
    }
};

// DOM elements
const scenarioSelector = document.querySelector('.scenario-selector');
const gameInterface = document.querySelector('.game-interface');
const resultsScreen = document.querySelector('.results-screen');
const scenarioCards = document.querySelectorAll('.scenario-card');
const currentScenarioElement = document.getElementById('current-scenario');
const dayNumberElement = document.getElementById('day-number');
const healthBar = document.getElementById('health-bar');
const healthValue = document.getElementById('health-value');
const resourcesBar = document.getElementById('resources-bar');
const resourcesValue = document.getElementById('resources-value');
const securityBar = document.getElementById('security-bar');
const securityValue = document.getElementById('security-value');
const situationTitle = document.getElementById('situation-title');
const situationDescription = document.getElementById('situation-description');
const survivalTip = document.getElementById('survival-tip');
const choicesContainer = document.getElementById('choices-container');
const restartButton = document.getElementById('restart-button');
const scenarioButton = document.getElementById('scenario-button');
const playAgainButton = document.getElementById('play-again-button');
const differentScenarioButton = document.getElementById('different-scenario-button');
const daysSurvivedElement = document.getElementById('days-survived');
const finalHealthElement = document.getElementById('final-health');
const finalResourcesElement = document.getElementById('final-resources');
const finalSecurityElement = document.getElementById('final-security');
const resultsTitle = document.getElementById('results-title');
const resultsMessage = document.getElementById('results-message');

// Initialize game
function init() {
    // Add event listeners to scenario cards
    scenarioCards.forEach(card => {
        card.addEventListener('click', () => {
            const scenario = card.getAttribute('data-scenario');
            startScenario(scenario);
        });
    });
    
    // Add event listeners to control buttons
    restartButton.addEventListener('click', restartGame);
    scenarioButton.addEventListener('click', showScenarioSelector);
    playAgainButton.addEventListener('click', restartGame);
    differentScenarioButton.addEventListener('click', showScenarioSelector);
}

// Start a new scenario
function startScenario(scenarioType) {
    gameState.currentScenario = scenarioType;
    gameState.day = 1;
    gameState.health = 100;
    gameState.resources = 100;
    gameState.security = 100;
    gameState.currentSituation = 0;
    gameState.survivalScore = 0;
    
    // Update UI
    currentScenarioElement.textContent = scenarios[scenarioType].name;
    updateStats();
    showSituation(0);
    
    // Switch to game interface
    scenarioSelector.classList.add('hidden');
    gameInterface.classList.remove('hidden');
    resultsScreen.classList.add('hidden');
}

// Show current situation
function showSituation(situationIndex) {
    const scenario = scenarios[gameState.currentScenario];
    const situation = scenario.situations[situationIndex];
    
    if (!situation) {
        endGame();
        return;
    }
    
    gameState.currentSituation = situationIndex;
    
    // Update situation display
    situationTitle.textContent = situation.title;
    situationDescription.textContent = situation.description;
    survivalTip.textContent = situation.tip;
    
    // Update choices
    choicesContainer.innerHTML = '';
    situation.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.className = 'choice-button';
        button.textContent = choice.text;
        button.addEventListener('click', () => makeChoice(choice));
        choicesContainer.appendChild(button);
    });
    
    // Update day counter
    dayNumberElement.textContent = gameState.day;
}

// Handle player choice
function makeChoice(choice) {
    // Apply effects
    gameState.health = Math.max(0, Math.min(100, gameState.health + (choice.effects.health || 0)));
    gameState.resources = Math.max(0, Math.min(100, gameState.resources + (choice.effects.resources || 0)));
    gameState.security = Math.max(0, Math.min(100, gameState.security + (choice.effects.security || 0)));
    
    // Update stats
    updateStats();
    
    // Advance to next day and situation
    gameState.day++;
    
    // Check for game over conditions
    if (gameState.health <= 0 || gameState.resources <= 0 || gameState.security <= 0) {
        endGame();
        return;
    }
    
    // Show next situation
    setTimeout(() => {
        showSituation(choice.nextSituation);
    }, 500);
}

// Update stat displays
function updateStats() {
    healthBar.style.width = `${gameState.health}%`;
    healthValue.textContent = `${gameState.health}%`;
    
    resourcesBar.style.width = `${gameState.resources}%`;
    resourcesValue.textContent = `${gameState.resources}%`;
    
    securityBar.style.width = `${gameState.security}%`;
    securityValue.textContent = `${gameState.security}%`;
    
    // Change color based on value
    updateStatColor(healthBar, gameState.health);
    updateStatColor(resourcesBar, gameState.resources);
    updateStatColor(securityBar, gameState.security);
}

// Update stat bar color based on value
function updateStatColor(barElement, value) {
    if (value > 70) {
        barElement.style.background = 'linear-gradient(90deg, #00ff9d, #00b8ff)';
    } else if (value > 30) {
        barElement.style.background = 'linear-gradient(90deg, #ff9d00, #ff6b00)';
    } else {
        barElement.style.background = 'linear-gradient(90deg, #ff2a6d, #ff006e)';
    }
}

// End game and show results
function endGame() {
    // Calculate survival score
    gameState.survivalScore = Math.round(
        (gameState.health + gameState.resources + gameState.security) / 3
    );
    
    // Update results display
    daysSurvivedElement.textContent = gameState.day - 1;
    finalHealthElement.textContent = `${gameState.health}%`;
    finalResourcesElement.textContent = `${gameState.resources}%`;
    finalSecurityElement.textContent = `${gameState.security}%`;
    
    // Determine result message
    if (gameState.health <= 0) {
        resultsTitle.textContent = "YOU DID NOT SURVIVE";
        resultsMessage.textContent = "Your health deteriorated beyond recovery. In a real scenario, prioritize medical supplies and avoid unnecessary risks to your wellbeing.";
    } else if (gameState.resources <= 0) {
        resultsTitle.textContent = "RESOURCES DEPLETED";
        resultsMessage.textContent = "You ran out of essential supplies. Remember that resource management is critical in survival situations. Always have a plan for sustainable food and water sources.";
    } else if (gameState.security <= 0) {
        resultsTitle.textContent = "SECURITY BREACHED";
        resultsMessage.textContent = "Your defenses were overwhelmed. In apocalyptic scenarios, maintaining a secure location is often more important than acquiring additional resources.";
    } else if (gameState.survivalScore >= 80) {
        resultsTitle.textContent = "OUTSTANDING SURVIVAL";
        resultsMessage.textContent = "You demonstrated excellent survival instincts and decision-making. Your balanced approach to health, resources, and security would give you a real advantage in an apocalyptic scenario.";
    } else if (gameState.survivalScore >= 60) {
        resultsTitle.textContent = "GOOD SURVIVAL CHANCES";
        resultsMessage.textContent = "You made solid decisions that would improve your survival odds. Consider focusing more on resource conservation and long-term planning.";
    } else {
        resultsTitle.textContent = "SURVIVAL NEEDS IMPROVEMENT";
        resultsMessage.textContent = "Your strategy needs refinement. In real survival situations, balance is key - don't focus too much on one aspect at the expense of others.";
    }
    
    // Show results screen
    gameInterface.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
}

// Restart current scenario
function restartGame() {
    if (gameState.currentScenario) {
        startScenario(gameState.currentScenario);
    } else {
        showScenarioSelector();
    }
}

// Show scenario selection screen
function showScenarioSelector() {
    scenarioSelector.classList.remove('hidden');
    gameInterface.classList.add('hidden');
    resultsScreen.classList.add('hidden');
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', init);