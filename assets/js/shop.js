/* Queen's Bakery shop — own code. Cart holds the one online product
   (Original Chinese Rice Puffs $10.25, min 3 boxes, free shipping at 6+),
   exactly the rules of the bakery's own online shop. localStorage cart. */
(function(){
  "use strict";
  var PRICE = 10.25, MIN = 3, FREE_AT = 6;
  var KEY = "qb-cart-v1";
  var cart = 0;
  try { cart = parseInt(localStorage.getItem(KEY) || "0", 10) || 0; } catch(e){}

  var drawer = document.getElementById("cartDrawer");
  var backdrop = document.getElementById("cartBackdrop");
  var itemsEl = document.getElementById("cartItems");
  var countEl = document.getElementById("cartCount");
  var subEl = document.getElementById("cartSubtotal");
  var shipEl = document.getElementById("cartShipping");
  var shipProgress = document.getElementById("shipProgress");
  var shipMsg = document.getElementById("shipMsg");
  var shipFill = document.getElementById("shipBarFill");
  var msgEl = document.getElementById("cartMsg");
  var qtyOut = document.getElementById("puffQty");
  var pendingQty = MIN;

  function money(n){ return "$" + n.toFixed(2); }
  function save(){ try { localStorage.setItem(KEY, String(cart)); } catch(e){} }

  function render(){
    countEl.hidden = cart === 0;
    countEl.textContent = cart;
    if (qtyOut) qtyOut.textContent = pendingQty;
    if (cart === 0){
      itemsEl.innerHTML = '<p class="cart-empty">Your box is empty.<br>Add three boxes of rice puffs to begin.</p>';
      shipProgress.hidden = true;
    } else {
      itemsEl.innerHTML =
        '<div class="cart-line">' +
          '<img src="assets/img/puffs.jpg" alt="Rice puffs">' +
          '<div><div class="cart-line__name">Original Chinese Rice Puffs</div>' +
          '<div class="cart-line__price">' + money(PRICE) + ' / box · 12 oz</div></div>' +
          '<span class="qty"><button type="button" id="lineMinus" aria-label="One less">−</button><output>' + cart + '</output><button type="button" id="linePlus" aria-label="One more">+</button></span>' +
        '</div>';
      var minus = document.getElementById("lineMinus");
      var plus = document.getElementById("linePlus");
      if (minus) minus.addEventListener("click", function(){ cart = Math.max(0, cart-1); save(); render(); });
      if (plus) plus.addEventListener("click", function(){ cart += 1; save(); render(); });
      shipProgress.hidden = false;
      if (cart >= FREE_AT){
        shipMsg.textContent = "Free shipping unlocked — " + cart + " boxes travel free.";
        shipFill.style.width = "100%";
      } else {
        shipMsg.textContent = (FREE_AT - cart) + " more box" + (FREE_AT-cart===1?"":"es") + " to free shipping.";
        shipFill.style.width = Math.round(cart/FREE_AT*100) + "%";
      }
    }
    subEl.textContent = money(cart * PRICE);
    shipEl.textContent = cart === 0 ? "—" : (cart >= FREE_AT ? "FREE" : "Calculated on order");
  }

  function openCart(){ drawer.classList.add("is-open"); backdrop.classList.add("is-open"); }
  function closeCart(){ drawer.classList.remove("is-open"); backdrop.classList.remove("is-open"); }

  ["cartToggle","cartToggleMobile"].forEach(function(id){
    var b = document.getElementById(id);
    if (b) b.addEventListener("click", openCart);
  });
  var closeBtn = document.getElementById("cartClose");
  if (closeBtn) closeBtn.addEventListener("click", closeCart);
  if (backdrop) backdrop.addEventListener("click", closeCart);
  document.addEventListener("keydown", function(e){ if (e.key === "Escape") closeCart(); });

  document.querySelectorAll("[data-qty]").forEach(function(btn){
    btn.addEventListener("click", function(){
      pendingQty = Math.max(1, pendingQty + parseInt(btn.getAttribute("data-qty"),10));
      render();
    });
  });
  var addBtn = document.getElementById("addPuffs");
  if (addBtn) addBtn.addEventListener("click", function(){
    cart += pendingQty; save(); render(); openCart();
  });

  var checkout = document.getElementById("checkoutBtn");
  if (checkout) checkout.addEventListener("click", function(){
    if (cart === 0){ msgEl.textContent = "Your box is empty — add rice puffs first."; return; }
    if (cart < MIN){ msgEl.textContent = "The minimum online order is 3 boxes. Add " + (MIN-cart) + " more to order."; return; }
    msgEl.textContent = "";
    var total = money(cart * PRICE);
    var ship = cart >= FREE_AT ? "FREE (6+ boxes)" : "to be calculated";
    var body = encodeURIComponent(
      "Hello Queen's Bakery,\n\nI would like to order:\n\n" +
      cart + " × Original Chinese Rice Puffs — " + money(PRICE) + " / box\n" +
      "Subtotal: " + total + "\nShipping: " + ship + "\n\nName:\nDelivery address:\nPhone:\n\nThank you!");
    window.location.href = "mailto:queensbakery.onlinesales@gmail.com?subject=" +
      encodeURIComponent("Online order — " + cart + " × Chinese Rice Puffs") + "&body=" + body;
  });

  render();
})();
