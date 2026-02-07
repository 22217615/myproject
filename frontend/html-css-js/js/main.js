

// Generic function to scroll to a section
function scrollToSection(buttonId, sectionId) {
    const button = document.getElementById(buttonId);
    const section = document.getElementById(sectionId);

    if (!button || !section) return;

    button.addEventListener("click", function () {
        const originalText = button.textContent;
        button.textContent = "Chargement...";

        section.scrollIntoView({ behavior: "smooth" });

        setTimeout(function () {
            button.textContent = originalText;
        }, 1000);
    });
}

// Attach scroll interactions (ONLY navigation buttons)
scrollToSection("menuBtn", "menu");
scrollToSection("orderBtn", "order");
scrollToSection("specialBtn", "special-order");

// Menu data
const menuData = [
    { name: "Plat A", price: 5, availability: 80 },
    { name: "Plat B", price: 7.5, availability: 25 },
    { name: "Plat C", price: 4, availability: 0 }
];

document.addEventListener("DOMContentLoaded", function () {

    /* ---------------- Restaurant status ---------------- */
    const restaurantStatusEl = document.getElementById("restaurantStatus");
    let restaurantOpen = true;

    if (restaurantOpen) {
        restaurantStatusEl.textContent = "Ouvert";
        restaurantStatusEl.classList.add("status-open");
    } else {
        restaurantStatusEl.textContent = "Fermé";
        restaurantStatusEl.classList.add("status-closed");
    }

    /* ---------------- Order system ---------------- */
    const order = [];
    const orderList = document.getElementById("orderList");
    const menuList = document.getElementById("menuList");
    const orderMessage = document.getElementById("orderMessage");
    const orderNumberEl = document.getElementById("orderNumber");
    const emptyMessage = document.getElementById("emptyMessage");
    const totalPriceEl = document.getElementById("totalPrice");
    const prepTimeEl = document.getElementById("prepTime");
    const scheduleTimeInput = document.getElementById("scheduleTime");
    const scheduleBtn = document.getElementById("scheduleBtn");
    const scheduleMessage = document.getElementById("scheduleMessage");

    const confirmBtn = document.getElementById("confirmBtn");
    const confirmMessage = document.getElementById("confirmMessage");
   let deliveryMode = "pickup";

    function renderOrder() {
         confirmBtn.disabled = (order.length === 0);
        if (order.length === 0) {
            emptyMessage.style.display = "block";
            orderList.innerHTML = "";
            totalPriceEl.textContent = "Total : 0 $";
            prepTimeEl.textContent = "Temps estimé : 0 minutes";
            return;
        }

        emptyMessage.style.display = "none";
        orderList.innerHTML = "";
        let total = 0;
        let prepTime = 0;
        order.forEach(function (orderItem, index) {
            const li = document.createElement("li");
            const itemTotal = orderItem.price * orderItem.quantity;
           prepTime += orderItem.quantity * 5;
            li.textContent =
                orderItem.name +
                " × " + orderItem.quantity +
                " — " + itemTotal.toFixed(2) + " $ ";

            const removeBtn = document.createElement("button");
            removeBtn.textContent = "❌";

            removeBtn.addEventListener("click", function () {
                if (orderItem.quantity > 1) {
                    orderItem.quantity -= 1;
                } else {
                    order.splice(index, 1);
                }
                renderOrder();
            });

            li.appendChild(removeBtn);
            orderList.appendChild(li);
            total += itemTotal;
        });

      if (deliveryMode === "delivery") {
    total += 2;
}

totalPriceEl.textContent = "Total : " + total.toFixed(2) + " $";
prepTimeEl.textContent =
    "Temps estimé : " + prepTime + " minutes";
    }

    /*confirm button */

confirmBtn.addEventListener("click", function ()
{
    if (order.length === 0)
    {
        confirmMessage.textContent =
            "Votre commande est vide.";
        return;
    }

    let total = 0;
    let prepTime = 0;

    order.forEach(function (item)
    {
        total += item.price * item.quantity;
        prepTime += item.quantity * 5;
    });

    if (deliveryMode === "delivery")
    {
        total += 2;
    }

    confirmMessage.textContent =
        "✅ Commande confirmée ! | Total : " +
        total.toFixed(2) +
        " $ | Temps estimé : " +
        prepTime +
        " minutes | Mode : " +
        (deliveryMode === "delivery" ? "Livraison" : "Retrait");
});

    /* ---------------- Menu rendering ---------------- */
    menuData.forEach(function (item) {
        const li = document.createElement("li");

        let availabilityText = "Disponibilité : " + item.availability + " %";
        let statusClass = "available";

        if (item.availability === 0) {
            availabilityText = "Indisponible";
            statusClass = "unavailable";
        } else if (item.availability <= 30) {
            statusClass = "low-stock";
        }

        li.textContent =
            item.name + " - " + item.price + " $ | " + availabilityText;
        li.classList.add(statusClass);

        if (item.availability > 0) {
            li.addEventListener("click", function () {
                if (!restaurantOpen) {
                    alert("Le restaurant est fermé pour le moment.");
                    return;
                }

                const existingItem = order.find(function (orderItem) {
                    return orderItem.name === item.name;
                });

                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    order.push({
                        name: item.name,
                        price: item.price,
                        quantity: 1
                    });
                }

                orderMessage.textContent =
                    "Ajouté à la commande : " + item.name;

                renderOrder();
            });
        }

        menuList.appendChild(li);
    });

    /* ---------------- Budget vs Menu ---------------- */
    const budgetBtn = document.getElementById("budgetBtn");

    budgetBtn.addEventListener("click", function () {
        const budget = parseFloat(prompt("Entrez votre budget"));

        if (isNaN(budget) || budget <= 0) {
            alert("Veuillez entrer un budget valide");
            return;
        }

        const affordableItems = menuData.filter(function (item) {
            return item.price <= budget && item.availability > 0;
        });

        if (affordableItems.length === 0) {
            alert("Aucun plat disponible pour ce budget");
            return;
        }

        let message = "Plats disponibles :\n";
        affordableItems.forEach(function (item) {
            message += item.name + " - " + item.price + " $\n";
        });

        alert(message);
    });
  
    const budgetInput = document.getElementById("budgetInput");
const checkBudgetBtn = document.getElementById("checkBudgetBtn");
const budgetResults = document.getElementById("budgetResults");

checkBudgetBtn.addEventListener("click", function () {

    const budget = parseFloat(budgetInput.value);

    budgetResults.innerHTML = "";

    if (isNaN(budget) || budget <= 0) {
        const li = document.createElement("li");
        li.textContent = "Veuillez entrer un budget valide.";
        budgetResults.appendChild(li);
        return;
    }

    const affordableItems = menuData.filter(function (item) {
        return item.price <= budget && item.availability > 0;
    });

    if (affordableItems.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Aucun plat disponible pour ce budget.";
        budgetResults.appendChild(li);
        return;
    }

   affordableItems.forEach(function (item) {

    const li = document.createElement("li");

    li.textContent =
        item.name + " — " + item.price + " $";

    li.style.cursor = "pointer";

    li.addEventListener("click", function () {

        const existingItem = order.find(function (orderItem) {
            return orderItem.name === item.name;
        });

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            order.push({
                name: item.name,
                price: item.price,
                quantity: 1
            });
        }

        orderMessage.textContent =
            "Ajouté depuis Budget : " + item.name;

        renderOrder();

    });

    budgetResults.appendChild(li);

});


});

/* Confirm Order System */

const confirmOrderBtn = document.getElementById("confirmOrderBtn");

confirmOrderBtn.addEventListener("click", function () {

    if (order.length === 0) {
        alert("Votre commande est vide.");
        return;
    }

    alert("Commande confirmée ! Merci.");

 
    if (order.length === 0) {
        return;
    }

const orderNumber = Math.floor(Math.random() * 100000);

orderNumberEl.textContent =
    "Numéro de commande : #" + orderNumber;

    orderMessage.textContent = "Commande envoyée avec succès.";

     order.length = 0;

    renderOrder();

});
 /*Detect selection change */
 const deliveryRadios = document.querySelectorAll('input[name="deliveryMode"]');

deliveryRadios.forEach(function (radio) {
    radio.addEventListener("change", function () {
        deliveryMode = this.value;
        renderOrder();
    });
});
 /*scheduling delivery time  */
scheduleBtn.addEventListener("click", function ()
{
    const selectedTime = scheduleTimeInput.value;

    if (selectedTime === "")
    {
        scheduleMessage.textContent =
            "Veuillez choisir une heure.";
        return;
    }

    scheduleMessage.textContent =
        "Commande planifiée pour : " + selectedTime;
});

 /*videe la commande */

 const clearOrderBtn = document.getElementById("clearOrderBtn");

clearOrderBtn.addEventListener("click", function () {

    order.length = 0;

    orderMessage.textContent = "Commande vidée.";

    renderOrder();

});

renderOrder();
});


