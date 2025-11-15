// Application state
const appState = {
    people: [],
    items: [],
    subtotal: 0,
    taxAmount: 0,
    tipAmount: 0,
    totalAmount: 0,
    personShares: []
};

// DOM elements
const totalBillInput = document.getElementById('total-bill');
const taxPercentInput = document.getElementById('tax-percent');
const tipPercentInput = document.getElementById('tip-percent');
const peopleCountElement = document.getElementById('people-count');
const decreasePeopleBtn = document.getElementById('decrease-people');
const increasePeopleBtn = document.getElementById('increase-people');
const peopleContainer = document.getElementById('people-container');
const itemsContainer = document.getElementById('items-container');
const addPersonBtn = document.getElementById('add-person');
const addItemBtn = document.getElementById('add-item');
const calculateBtn = document.getElementById('calculate-btn');
const resetBtn = document.getElementById('reset-btn');
const resultsPanel = document.getElementById('results-panel');
const subtotalAmountElement = document.getElementById('subtotal-amount');
const taxAmountElement = document.getElementById('tax-amount');
const tipAmountElement = document.getElementById('tip-amount');
const totalAmountElement = document.getElementById('total-amount');
const personSharesContainer = document.getElementById('person-shares');
const whatsappShareBtn = document.getElementById('whatsapp-share');
const emailShareBtn = document.getElementById('email-share');
const copyLinkBtn = document.getElementById('copy-link');

// Initialize the application
function init() {
    // Set up event listeners
    totalBillInput.addEventListener('input', updateCalculations);
    taxPercentInput.addEventListener('input', updateCalculations);
    tipPercentInput.addEventListener('input', updateCalculations);
    
    decreasePeopleBtn.addEventListener('click', decreasePeopleCount);
    increasePeopleBtn.addEventListener('click', increasePeopleCount);
    
    addPersonBtn.addEventListener('click', addPerson);
    addItemBtn.addEventListener('click', addItem);
    
    calculateBtn.addEventListener('click', calculateSplit);
    resetBtn.addEventListener('click', resetApp);
    
    whatsappShareBtn.addEventListener('click', shareViaWhatsApp);
    emailShareBtn.addEventListener('click', shareViaEmail);
    copyLinkBtn.addEventListener('click', copyShareLink);
    
    // Initialize with default people and items
    initializeDefaultData();
    
    // Render initial state
    renderPeople();
    renderItems();
}

// Initialize with default data
function initializeDefaultData() {
    // Add default people
    appState.people = [
        { id: 1, name: 'You', color: '#4361ee' },
        { id: 2, name: 'Alex', color: '#7209b7' },
        { id: 3, name: 'Sam', color: '#4cc9f0' },
        { id: 4, name: 'Jordan', color: '#f72585' }
    ];
    
    // Add default items
    appState.items = [
        { 
            id: 1, 
            name: 'Pizza', 
            price: 18.00, 
            consumers: [1, 2, 3, 4] 
        },
        { 
            id: 2, 
            name: 'Burger', 
            price: 14.00, 
            consumers: [1, 2] 
        },
        { 
            id: 3, 
            name: 'Salad', 
            price: 10.00, 
            consumers: [3] 
        },
        { 
            id: 4, 
            name: 'Fries', 
            price: 5.00, 
            consumers: [2, 4] 
        },
        { 
            id: 5, 
            name: 'Drinks', 
            price: 12.00, 
            consumers: [1, 2, 3, 4] 
        }
    ];
    
    // Set initial bill total based on items
    const initialSubtotal = appState.items.reduce((sum, item) => sum + item.price, 0);
    totalBillInput.value = initialSubtotal.toFixed(2);
}

// Update calculations when inputs change
function updateCalculations() {
    const subtotal = parseFloat(totalBillInput.value) || 0;
    const taxPercent = parseFloat(taxPercentInput.value) || 0;
    const tipPercent = parseFloat(tipPercentInput.value) || 0;
    
    const taxAmount = subtotal * (taxPercent / 100);
    const tipAmount = subtotal * (tipPercent / 100);
    const totalAmount = subtotal + taxAmount + tipAmount;
    
    appState.subtotal = subtotal;
    appState.taxAmount = taxAmount;
    appState.tipAmount = tipAmount;
    appState.totalAmount = totalAmount;
}

// People count management
function decreasePeopleCount() {
    let count = parseInt(peopleCountElement.textContent);
    if (count > 1) {
        count--;
        peopleCountElement.textContent = count;
        
        // Remove the last person
        if (appState.people.length > count) {
            const removedPerson = appState.people.pop();
            
            // Remove this person from all items
            appState.items.forEach(item => {
                item.consumers = item.consumers.filter(consumerId => consumerId !== removedPerson.id);
            });
            
            renderPeople();
            renderItems();
        }
    }
}

function increasePeopleCount() {
    let count = parseInt(peopleCountElement.textContent);
    count++;
    peopleCountElement.textContent = count;
    
    // Add a new person if needed
    if (appState.people.length < count) {
        addPerson();
    }
}

// Add a new person
function addPerson() {
    const personId = appState.people.length > 0 ? 
        Math.max(...appState.people.map(p => p.id)) + 1 : 1;
    
    const colors = ['#4361ee', '#7209b7', '#4cc9f0', '#f72585', '#ff9e00', '#06d6a0', '#ef476f'];
    const color = colors[appState.people.length % colors.length];
    
    const newPerson = {
        id: personId,
        name: `Person ${personId}`,
        color: color
    };
    
    appState.people.push(newPerson);
    renderPeople();
}

// Render people list
function renderPeople() {
    peopleContainer.innerHTML = '';
    
    appState.people.forEach(person => {
        const personCard = document.createElement('div');
        personCard.className = 'person-card';
        
        // Get items consumed by this person
        const personItems = appState.items.filter(item => 
            item.consumers.includes(person.id)
        );
        
        const itemsText = personItems.length > 0 ? 
            `${personItems.length} item(s)` : 'No items';
        
        personCard.innerHTML = `
            <div class="person-avatar" style="background-color: ${person.color}">
                ${person.name.charAt(0)}
            </div>
            <div class="person-details">
                <div class="person-name">${person.name}</div>
                <div class="person-items">${itemsText}</div>
            </div>
            <button class="remove-btn" data-person-id="${person.id}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        peopleContainer.appendChild(personCard);
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const personId = parseInt(this.getAttribute('data-person-id'));
            removePerson(personId);
        });
    });
}

// Remove a person
function removePerson(personId) {
    if (appState.people.length <= 1) {
        alert('You need at least one person to split the bill!');
        return;
    }
    
    // Remove the person
    appState.people = appState.people.filter(person => person.id !== personId);
    
    // Remove this person from all items
    appState.items.forEach(item => {
        item.consumers = item.consumers.filter(consumerId => consumerId !== personId);
    });
    
    // Update people count
    peopleCountElement.textContent = appState.people.length;
    
    renderPeople();
    renderItems();
}

// Add a new item
function addItem() {
    const itemId = appState.items.length > 0 ? 
        Math.max(...appState.items.map(i => i.id)) + 1 : 1;
    
    const newItem = {
        id: itemId,
        name: `Item ${itemId}`,
        price: 0,
        consumers: [...appState.people.map(p => p.id)] // Default to all people
    };
    
    appState.items.push(newItem);
    renderItems();
    
    // Update bill total
    updateBillTotalFromItems();
}

// Render items list
function renderItems() {
    itemsContainer.innerHTML = '';
    
    appState.items.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        
        const consumerTags = appState.people
            .filter(person => item.consumers.includes(person.id))
            .map(person => `
                <span class="consumer-tag" style="background-color: ${person.color}">
                    ${person.name}
                </span>
            `).join('');
        
        itemCard.innerHTML = `
            <div class="item-details">
                <input type="text" class="item-name" value="${item.name}" 
                    data-item-id="${item.id}">
                <div class="input-with-icon">
                    <span class="currency">$</span>
                    <input type="number" class="item-price" value="${item.price.toFixed(2)}" 
                        min="0" step="0.01" data-item-id="${item.id}">
                </div>
                <div class="item-consumers">
                    ${consumerTags}
                </div>
            </div>
            <button class="remove-btn" data-item-id="${item.id}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        itemsContainer.appendChild(itemCard);
    });
    
    // Add event listeners
    document.querySelectorAll('.item-name').forEach(input => {
        input.addEventListener('input', function() {
            const itemId = parseInt(this.getAttribute('data-item-id'));
            updateItemName(itemId, this.value);
        });
    });
    
    document.querySelectorAll('.item-price').forEach(input => {
        input.addEventListener('input', function() {
            const itemId = parseInt(this.getAttribute('data-item-id'));
            updateItemPrice(itemId, parseFloat(this.value) || 0);
        });
    });
    
    document.querySelectorAll('.consumer-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            // In a full implementation, this would open a modal to edit consumers
            alert('In a full implementation, clicking a consumer would allow you to edit who consumed this item.');
        });
    });
    
    document.querySelectorAll('.remove-btn[data-item-id]').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-item-id'));
            removeItem(itemId);
        });
    });
}

// Update item name
function updateItemName(itemId, newName) {
    const item = appState.items.find(i => i.id === itemId);
    if (item) {
        item.name = newName;
    }
}

// Update item price
function updateItemPrice(itemId, newPrice) {
    const item = appState.items.find(i => i.id === itemId);
    if (item) {
        item.price = newPrice;
        updateBillTotalFromItems();
    }
}

// Update bill total based on items
function updateBillTotalFromItems() {
    const subtotal = appState.items.reduce((sum, item) => sum + item.price, 0);
    totalBillInput.value = subtotal.toFixed(2);
    updateCalculations();
}

// Remove an item
function removeItem(itemId) {
    appState.items = appState.items.filter(item => item.id !== itemId);
    renderItems();
    updateBillTotalFromItems();
}

// Calculate the bill split
function calculateSplit() {
    // Update calculations first
    updateCalculations();
    
    // Reset person shares
    appState.personShares = [];
    
    // Calculate item shares per person
    const personItemTotals = {};
    appState.people.forEach(person => {
        personItemTotals[person.id] = 0;
    });
    
    // Distribute item costs to consumers
    appState.items.forEach(item => {
        const costPerConsumer = item.price / item.consumers.length;
        
        item.consumers.forEach(consumerId => {
            personItemTotals[consumerId] += costPerConsumer;
        });
    });
    
    // Calculate tax and tip proportions based on item consumption
    const totalItemValue = appState.items.reduce((sum, item) => sum + item.price, 0);
    
    // Calculate each person's share
    appState.people.forEach(person => {
        const itemShare = personItemTotals[person.id];
        const taxShare = (itemShare / totalItemValue) * appState.taxAmount;
        const tipShare = (itemShare / totalItemValue) * appState.tipAmount;
        const totalShare = itemShare + taxShare + tipShare;
        
        appState.personShares.push({
            person: person,
            itemShare: itemShare,
            taxShare: taxShare,
            tipShare: tipShare,
            totalShare: totalShare
        });
    });
    
    // Update UI with results
    updateResultsUI();
    
    // Show results panel
    resultsPanel.classList.remove('hidden');
    
    // Scroll to results
    resultsPanel.scrollIntoView({ behavior: 'smooth' });
}

// Update the results UI
function updateResultsUI() {
    // Update summary cards
    subtotalAmountElement.textContent = `$${appState.subtotal.toFixed(2)}`;
    taxAmountElement.textContent = `$${appState.taxAmount.toFixed(2)}`;
    tipAmountElement.textContent = `$${appState.tipAmount.toFixed(2)}`;
    totalAmountElement.textContent = `$${appState.totalAmount.toFixed(2)}`;
    
    // Update person shares
    personSharesContainer.innerHTML = '';
    
    appState.personShares.forEach(share => {
        const shareElement = document.createElement('div');
        shareElement.className = 'person-share';
        
        shareElement.innerHTML = `
            <div class="person-avatar" style="background-color: ${share.person.color}">
                ${share.person.name.charAt(0)}
            </div>
            <div class="share-details">
                <div class="share-name">${share.person.name}</div>
                <div class="share-breakdown">
                    Items: $${share.itemShare.toFixed(2)} | 
                    Tax: $${share.taxShare.toFixed(2)} | 
                    Tip: $${share.tipShare.toFixed(2)}
                </div>
            </div>
            <div class="share-amount">$${share.totalShare.toFixed(2)}</div>
        `;
        
        personSharesContainer.appendChild(shareElement);
    });
}

// Reset the application
function resetApp() {
    if (confirm('Are you sure you want to reset? All data will be lost.')) {
        // Reset inputs
        totalBillInput.value = '0.00';
        taxPercentInput.value = '8.5';
        tipPercentInput.value = '15';
        peopleCountElement.textContent = '4';
        
        // Reset state
        appState.people = [];
        appState.items = [];
        appState.subtotal = 0;
        appState.taxAmount = 0;
        appState.tipAmount = 0;
        appState.totalAmount = 0;
        appState.personShares = [];
        
        // Reinitialize with default data
        initializeDefaultData();
        
        // Re-render
        renderPeople();
        renderItems();
        
        // Hide results
        resultsPanel.classList.add('hidden');
    }
}

// Share via WhatsApp
function shareViaWhatsApp() {
    if (appState.personShares.length === 0) {
        alert('Please calculate the split first!');
        return;
    }
    
    let message = "🌟 *SplitTheThing Bill Split* 🌟\n\n";
    message += `Total: $${appState.totalAmount.toFixed(2)}\n`;
    message += `Tax: $${appState.taxAmount.toFixed(2)} | Tip: $${appState.tipAmount.toFixed(2)}\n\n`;
    message += "*Individual Shares:*\n";
    
    appState.personShares.forEach(share => {
        message += `• ${share.person.name}: $${share.totalShare.toFixed(2)}\n`;
    });
    
    message += "\nPlease pay your share!";
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

// Share via Email
function shareViaEmail() {
    if (appState.personShares.length === 0) {
        alert('Please calculate the split first!');
        return;
    }
    
    let subject = "SplitTheThing - Bill Split Summary";
    let body = "Hello!\n\nHere's the breakdown of our bill:\n\n";
    body += `Total: $${appState.totalAmount.toFixed(2)}\n`;
    body += `Tax: $${appState.taxAmount.toFixed(2)}\n`;
    body += `Tip: $${appState.tipAmount.toFixed(2)}\n\n`;
    body += "Individual Shares:\n";
    
    appState.personShares.forEach(share => {
        body += `• ${share.person.name}: $${share.totalShare.toFixed(2)}\n`;
    });
    
    body += "\nThanks!";
    
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
}

// Copy share link
function copyShareLink() {
    if (appState.personShares.length === 0) {
        alert('Please calculate the split first!');
        return;
    }
    
    // In a real app, this would generate a unique shareable link
    // For this demo, we'll just copy a summary to clipboard
    let text = "SplitTheThing Bill Split Summary\n\n";
    text += `Total: $${appState.totalAmount.toFixed(2)}\n`;
    text += "Individual Shares:\n";
    
    appState.personShares.forEach(share => {
        text += `• ${share.person.name}: $${share.totalShare.toFixed(2)}\n`;
    });
    
    navigator.clipboard.writeText(text).then(() => {
        alert('Bill summary copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy to clipboard. Please try again.');
    });
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', init);