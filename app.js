var randomCockTailDBURL = "https://www.thecocktaildb.com/api/json/v1/1/random.php"


// variables
//повертає перший елемент документу, що відповідає вказаному селектору
//дістаємо з html-сторінки об'єкти, що там знаходяться, та присвоюємо деяку поведінку
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");
let cart = [];
//оголошуємо локальну змінну блочної області видимості, з необов'язковим присвоєнням їй початкового значення.


// products
class Products {
    //оголошуємо асинхрону функцію
  async getProducts() {
    try {
      let result = await fetch("list.json");
        //функціонал для роботи з запитами //забираємо дані з data_list
      let data = await result.json();
      let products = data.items;
         //створюємо новий масив активностей
      products = products.map(item => { //поля обєкту
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, id, image };
      });
      console.log(products);//вивід на екран

      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

// ui візуалізація продуктів
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach(product => {
      result += `
   <!-- single product -->
        <article class="product">
          <div class="img-container">
            <img
              src=${product.image}
              alt="product"
              class="product-img"
            />
            <button class="bag-btn" data-id=${product.id}>
              <i class="fas fa-shopping-cart"></i> add </button>
          </div>
          <h3>${product.title}</h3>
          <h4>${product.price}</h4>
        </article>
        <!-- end of single product -->
   `;
    });
    productsDOM.innerHTML = result; //встановлює розмітку html дочірніх елементів, відповідає за зовнішній вигляд
  }
    
      //робота з кнопками
  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")]; //створюється запит, щоб присвоїти змінній якусь поведінку
    buttons.forEach(button => {
      let id = button.dataset.id;
//присвоюємо кнопці id
      let inCart = cart.find(item => item.id === id);
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;  //активність додана до кошику
      } else {
        button.addEventListener("click", event => {
          // disable button
          event.target.innerText = "In Bag";
          event.target.disabled = true;
          // add to cart
          let cartItem = { ...Storage.getProduct(id), amount: 1 };
          cart = [...cart, cartItem];
          Storage.saveCart(cart);
          // add to DOM
            //кошик з цією активністю, що ми додали
          this.setCartValues(cart);
          this.addCartItem(cartItem);
          this.showCart();
        });
      }
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map(item => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal; //присвоюємо нове значення
  }

    //додати активність в кошик
  addCartItem(item) {
    const div = document.createElement("div");//створюємо деякий елемент, якому потім присвоємо div кошик
    div.classList.add("cart-item");
       //одає клас у атрибут class елементу.
    //створюємо html-розмітку
    div.innerHTML = `<!-- cart item -->
            <!-- item image -->
            <img src=${item.image} alt="product" />
            <!-- item info -->
            <div>
              <h4>${item.title}</h4>
              <h5>${item.price}</h5>
              <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <!-- item functionality -->
            <div>
                <i class="fas fa-chevron-up" data-id=${item.id}></i>
              <p class="item-amount">
                ${item.amount}
              </p>
                <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>
          <!-- cart item -->
    `;
    cartContent.appendChild(div);
      //Додає нову node в кінець списку
  }
  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }
    //додаємо функціонал кошика
  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
  }
      //наповнюємо кошик
  populateCart(cart) {
    cart.forEach(item => this.addCartItem(item));
  }
  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }
  cartLogic() {
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });
    cartContent.addEventListener("click", event => {
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cart = cart.filter(item => item.id !== id);
          //повертає елемент, який задовольняє умову
        console.log(cart);

        this.setCartValues(cart);
        Storage.saveCart(cart);
        cartContent.removeChild(removeItem.parentElement.parentElement);
          //видаляємо непотрібні nodes і обєднуємо їх з першими
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttons.forEach(button => {
          if (parseInt(button.dataset.id) === id) {
            button.disabled = false;
            button.innerHTML = `<i class="fas fa-shopping-cart"></i>add`;
          }
        });
      } 
        else {
          cart = cart.filter(item => item.id !== id);
          // console.log(cart);

          this.setCartValues(cart);
          Storage.saveCart(cart);
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          const buttons = [...document.querySelectorAll(".bag-btn")];
          buttons.forEach(button => {
            if (parseInt(button.dataset.id) === id) {
              button.disabled = false;
              button.innerHTML = `<i class="fas fa-shopping-cart"></i>add`;
            }
          });
        }
      }
    );
  }
    
  //метод, що чистить кошик
  clearCart() {
    // console.log(this);

    cart = [];
    this.setCartValues(cart);
    Storage.saveCart(cart);
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttons.forEach(button => {
      button.disabled = false;
      button.innerHTML = `<i class="fas fa-shopping-cart"></i>add`;
    });
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
  }
}

//клас, що відповідає за збереження даних
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }//зберігаємо у веб-сховищі пару ключ/значення
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products")); //сonverts a JavaScript Object Notation (JSON) string into an object.
    return products.find(product => product.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}



//запускамо звязок js з html сторінкою
document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
  ui.setupAPP();

  // get all products
  products
    .getProducts()
    .then(products => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
      ui.cartLogic();
    });
});
