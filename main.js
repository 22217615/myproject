document.addEventListener("DOMContentLoaded", function () {

    function toggleSection(sectionId) {
        const section = document.getElementById(sectionId);
        section.style.display = (section.style.display === "none") ? "block" : "none";
    }

    menuBtn.onclick = () => toggleSection("menu");
    orderBtn.onclick = () => toggleSection("order");
    specialBtn.onclick = () => toggleSection("special-order");
    budgetBtn.onclick = () => toggleSection("budget");

    const restaurantStatus = document.getElementById("restaurantStatus");
    const hour = new Date().getHours();
    restaurantStatus.textContent = (hour >= 8 && hour <= 22) ? "Ouvert" : "Fermé";
    restaurantStatus.className = (hour >= 8 && hour <= 22) ? "status-open" : "status-closed";

    const menuData = [
        { name: "Plat A", price: 5, availability: 80, color: "#e74c3c", featured:true },
        { name: "Plat B", price: 7.5, availability: 25, color: "#f39c12", featured:false },
        { name: "Plat C", price: 4, availability: 0, color: "#7f8c8d", featured:false },
        { name: "Plat D", price: 10, availability: 100, color: "#27ae60", featured:true },
        { name: "Plat E", price: 6, availability: 60, color: "#9b59b6", featured:false },
        { name: "Plat F", price: 8, availability: 45, color: "#16a085", featured:false },
        { name: "Plat G", price: 9, availability: 70, color: "#2ecc71", featured:true },
        { name: "Plat H", price: 11, availability: 90, color: "#34495e", featured:false }
    ];

    const order = JSON.parse(localStorage.getItem("order")) || [];
    const badge = document.getElementById("cartBadge");

    function showAddMessage(name){
        const msg = document.createElement("div");
        msg.textContent = `${name} ajouté au panier ✅`;
        msg.className = "add-message";
        document.body.appendChild(msg);
        setTimeout(()=> msg.remove(), 1500);
    }

    function createMenuItem(item, container) {
        const li = document.createElement("li");

        let availabilityText = `Disponibilité : ${item.availability} %`;
        let statusClass = "available";

        if (item.availability === 0) { availabilityText = "Indisponible"; statusClass = "unavailable"; }
        else if (item.availability <= 30) { statusClass = "low-stock"; }

        li.classList.add(statusClass);
        li.style.borderTop = `5px solid ${item.color}`;

        li.innerHTML = `<span>${item.name} - ${item.price} $</span><p>${availabilityText}</p>`;
        if(item.featured) li.innerHTML += `<span class="badge-featured">🔥 Populaire</span>`;

        if (item.availability > 0) {
            li.onclick = function () {
                const existing = order.find(o => o.name === item.name);
                if (existing) existing.quantity++;
                else order.push({ name: item.name, price: item.price, quantity: 1 });

                saveOrder();
                renderOrder();
                animateBadge();
                showAddMessage(item.name);
            };
        }
        container.appendChild(li);
    }

    const menuList = document.getElementById("menuList");
    const menuListOrder = document.getElementById("menuListOrder");

    menuData.forEach(item => { createMenuItem(item, menuList); createMenuItem(item, menuListOrder); });

    function saveOrder() { localStorage.setItem("order", JSON.stringify(order)); }
    function updateBadge() { badge.textContent = order.reduce((sum, item) => sum + item.quantity, 0); }
    function animateBadge() { badge.classList.remove("badge"); void badge.offsetWidth; badge.classList.add("badge"); }

    function renderOrder() {
        const orderList = document.getElementById("orderList");
        const totalPrice = document.getElementById("totalPrice");
        const prepTime = document.getElementById("prepTime");
        const emptyMessage = document.getElementById("emptyMessage");

        orderList.innerHTML = "";
        let total = 0, prep = 0;

        if (order.length === 0) {
            emptyMessage.style.display = "block";
            totalPrice.textContent = "Total : 0 $";
            prepTime.textContent = "";
            updateBadge();
            return;
        }

        emptyMessage.style.display = "none";

        order.forEach((item,index)=>{
            const li=document.createElement("li");
            li.innerHTML = `${item.name} × ${item.quantity} — ${(item.price*item.quantity).toFixed(2)} $ 
            <div class="order-item-controls">
                <button onclick="changeQty(${index},-1)">−</button>
                <button onclick="changeQty(${index},1)">+</button>
                <button onclick="removeItem(${index})">🗑</button>
            </div>`;
            orderList.appendChild(li);
            total += item.price*item.quantity;
            prep += item.quantity*5;
        });

        const mode = document.querySelector('input[name="deliveryMode"]:checked').value;
        if(mode==="delivery"){ total+=2; prepTime.textContent=`Temps estimé : ${prep} minutes`; }
        else prepTime.textContent="";

        totalPrice.textContent=`Total : ${total.toFixed(2)} $`;
        updateBadge();
    }

    window.changeQty=function(index,delta){ order[index].quantity+=delta; if(order[index].quantity<=0) order.splice(index,1); saveOrder(); renderOrder(); animateBadge(); };
    window.removeItem=function(index){ order.splice(index,1); saveOrder(); renderOrder(); animateBadge(); };

    clearOrderBtn.onclick=function(){ order.length=0; saveOrder(); renderOrder(); animateBadge(); };
    confirmBtn.onclick=function(){ confirmMessage.textContent=order.length?"✅ Commande confirmée !":"Votre commande est vide."; };
    document.querySelectorAll('input[name="deliveryMode"]').forEach(radio=>radio.addEventListener("change",renderOrder));
    renderOrder();

    checkBudgetBtn.onclick=function(){
        const budget=parseFloat(budgetInput.value)||0;
        const results=menuData.filter(i=>i.price<=budget);
        budgetResults.innerHTML = results.length?results.map(i=>`<li>${i.name} - ${i.price}$</li>`).join(''):"<li>Aucun plat ne rentre dans ce budget 😢</li>";
    };

    scheduleBtn.onclick=function(){
        const time=scheduleTime.value;
        scheduleMessage.textContent = time?`✅ Commande planifiée à ${time}`:"Veuillez choisir une heure";
    };

});
