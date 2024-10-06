// const cart = document.querySelector(".cart");
// const hidden = document.getElementById("hidden");
const count = document.getElementById("number");
// const img = document.querySelector(".image")

const emptyCart = document.querySelector(".emptyCart")
const orderCart = document.querySelector(".orderCart")
const confirmO = document.querySelector("#confirm")
const carbon = document.querySelector("#carbon")
const quantity = document.querySelector(".quantity")


let cartArray =[]
let totalprice = 0

const cartQty = document.getElementById('qty');
const cartItems = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');


function loadMenu(){
    fetch("./data.json")
   .then((response) => response.json())
   .then((data) => { 
  
     let menu = '';
    
        data.forEach((food, index)=>{
            menu += `<div class="foodCard" id="${food.category}">
                    <img src="${food.image.desktop}"class="image"> <br>
                    <button class="cart" onclick="appendItem(${index})" ><img src="./assets/images/icon-add-to-cart.svg" alt="">Add to Cart</button>

                    <div id="hidden">
                <img src="./assets/images/icon-decrement-quantity.svg" alt="minus" id="minus"  onclick="reduceC()">
                        <p id="number">1</p>
            <img src="./assets/images/icon-increment-quantity.svg" alt="plus" id="plus" onclick="increaseC()">
                    </div>

                    <p>${food.category}</p>
                    <h6>${food.name}</h6>
                    <h5>$${food.price.toFixed(2)}</h5>

                </div>`
    
            document.querySelector(".card").innerHTML = menu
        })
                       
    })
               
};
loadMenu()


function appendItem(productIndex) {

    fetch("./data.json")
    .then((response) => response.json())
    .then((data) => { 
        const product = data[productIndex];
        const existingProduct = cartArray.find(item => item.name === product.name);
  
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cartArray.push({ ...product, quantity: 1 });
            }

        totalprice += product.price
        addToCart();
          
    })
   
    emptyCart.style.display="none"
    confirmO.style.display="block"
    carbon.style.display="flex"
    orderCart.style.display="block"
}

function addToCart(){  
    cartQty.textContent = cartArray.reduce((total, item) => total + item.quantity, 0);

    
    

    // cartQty.textContent ++
    //= carttt.reduce((total, item) => total + item.quantity, 0);
  
    cartItems.innerHTML = '';
  
    cartArray.forEach((food, index)=>{
      const newCart = `<div class="orderCartJ">
                        <div class="order1">
                         <h6 class="category">${food.name}</h6>
                         
  
                        <div class="orderD">
                         <p id="quantity"> <span class="quantity"> ${food.quantity} </span>X</p>
                          <p class="price">${food.price.toFixed(2)}</p>
                          <p class="totprice">${(food.price * food.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                          <img src="./assets/images/icon-remove-item.svg" alt="" id="remove" onclick="removeFromCart(${index})">
  
                      </div>`;
                      cartItems.innerHTML += newCart
  
                    //   document.querySelector(".cart").style.display="none"
                    //   document.querySelector("#hidden").style.display="flex"
                    //   document.querySelector(".image").style.border="3px solid red"
    })
    totalPriceElement.textContent = totalprice.toFixed(2)
    
    document.querySelector(".cart").style.display="none"
    document.querySelector("#hidden").style.display="flex"
    document.querySelector(".image").style.border="3px solid red"
   
}

function removeFromCart(productIndex) {
    const product = cartArray[productIndex];
    totalprice -= product.price * product.quantity;
    cartArray.splice(productIndex, 1);

    addToCart();

    if (cartQty.textContent===0) {
        // loadMenu()
        emptyCart.style.display="block"
        confirmO.style.display="none"
        carbon.style.display="none"
        orderCart.style.display="none"
    }

}

function reduceC(){
    document.getElementById("number").textContent-- 
    cartQty.textContent--
    document.querySelector(".quantity").textContent--

    if (document.getElementById("number").textContent<1) {
        document.querySelector(".cart").style.display="block"
        document.querySelector("#hidden").style.display="none"
        document.querySelector(".image").style.border="none"
        emptyCart.style.display="block"
        orderCart.style.display="none"

    }
}

function increaseC(){
    document.getElementById("number").textContent++
    cartQty.textContent++
    document.querySelector(".quantity").textContent++

}