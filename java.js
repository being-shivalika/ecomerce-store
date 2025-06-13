const API_URL = 'https://fakestoreapi.com/products';
const grid = document.getElementById('productGrid');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalPrice = document.getElementById('modalPrice');
const closeModal = document.getElementById('closeModal');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const priceValue = document.getElementById('priceValue');

let allProducts = [];

async function fetchProducts() {
  const res = await fetch(API_URL);
  const data = await res.json();
  allProducts = data;
  updateCategories(data);
  renderProducts(data);
}

function updateCategories(products) {
  const categories = [...new Set(products.map(p => p.category))];
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

function renderProducts(products) {
  grid.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'bg-white p-4 rounded shadow hover:shadow-lg transition cursor-pointer';
    card.innerHTML = `
      <img src="${product.image}" class="w-full h-48 object-contain mb-2" />
      <h2 class="text-lg font-semibold">${product.title}</h2>
      <p class="text-sm text-gray-600 mb-1">${product.category}</p>
      <p class="text-indigo-600 font-bold text-lg">$${product.price}</p>
      <button class="addCartBtn mt-2 bg-indigo-500 text-white px-3 py-1 rounded">Add to Cart</button>
    `;
    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('addCartBtn')) {
        showModal(product);
      }
    });
    card.querySelector('.addCartBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      e.target.textContent = "✓ Added!";
      setTimeout(() => e.target.textContent = "Add to Cart", 1000);
    });
    grid.appendChild(card);
  });
}

function showModal(product) {
  modalImg.src = product.image;
  modalTitle.textContent = product.title;
  modalDesc.textContent = product.description;
  modalPrice.textContent = `$${product.price}`;
  modal.classList.remove('hidden');
}

closeModal.addEventListener('click', () => modal.classList.add('hidden'));

priceFilter.addEventListener('input', () => {
  priceValue.textContent = `Max: $${priceFilter.value}`;
  filterProducts();
});

categoryFilter.addEventListener('change', filterProducts);

function filterProducts() {
  const maxPrice = parseFloat(priceFilter.value);
  const category = categoryFilter.value;
  const filtered = allProducts.filter(p =>
    p.price <= maxPrice && (category === 'all' || p.category === category)
  );
  renderProducts(filtered);
}

fetchProducts();

