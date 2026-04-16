const categories = ['business', 'entertainment', 'health', 'science', 'sports', 'technology'];
let currentCategory = 'business';
let currentPage = 1;
let pageSize = 12;
let isLoading = false;
const apiKey = '67d074cd066048f8aad9bbaaad6d4801'
let searchQuery = '';

const navDrawer = document.getElementById('nav-drawer');
const navBar = document.getElementById('nav-bar');
const drawerBar = document.getElementById('drawer-bar');
const toggleButton = document.getElementById('toggle-mode');
const menuButton = document.getElementById('menu-btn');
const closeDrawerButton = document.getElementById('close-drawer-btn');
const errorDiv = document.getElementById('error');
const newsContainer = document.getElementById('news-container');
const searchInput = document.getElementById('search-input');

function createCategoryElements(parent) {
    categories.forEach(category => {
        const navItem = document.createElement('div');
        navItem.classList.add('nav-item');
        navItem.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        navItem.addEventListener('click', () => {
            currentCategory = category;
            currentPage = 1;
            newsContainer.innerHTML = '';
            fetchNews();
            navDrawer.classList.remove('open')
        })
        parent.appendChild(navItem);
    })
}

async function fetchNews() {
 if(isLoading) return;
 isLoading = true;
 errorDiv.classList.add('hidden');
 try {
    const queryParam = searchQuery ? `&q=${searchQuery}` : `&category=${currentCategory}`; 
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&page=${currentPage}&pageSize=${pageSize}${queryParam}&apiKey=${apiKey}`);
    const data = await response.json();
    displayNews(data.articles);
    currentPage++;
 } catch (error){
    errorDiv.classList.remove('hidden');
 } finally {
    isLoading = false;
 }
}

let debounceTimer;


function debounce(fun, delay) {
    return (...args) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            fun(...args);
        }, delay)
    }
}

searchInput.addEventListener('input', debounce((e) => {
    searchQuery = e.target.value;
    currentPage = 1;
    newsContainer.innerHTML = '';
    fetchNews();
}, 300))

window.addEventListener('scroll', () => {
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 500){
        fetchNews();
    }
})

function displayNews(articles) {
    articles.forEach(article => {
        const newsItem = document.createElement('div');
        newsItem.classList.add('news-item');
        newsItem.innerHTML = `<img src="${article.urlToImage || 'default.jpg'}" alt="News Image" />
        <div class="content">
         <h2>${article.title}</h2>
         <p>${article.description || 'No news description available'}</p>
         <a href="${article.url}" target="_blank">Read more</a>
        </div>`
        newsContainer.appendChild(newsItem);
    })
}

toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    toggleButton.textContent = document.body.classList.contains('dark-mode') ? '🌙' : '🌞';
})

menuButton.addEventListener('click', () => navDrawer.classList.toggle('open'))
closeDrawerButton.addEventListener('click', () => navDrawer.classList.toggle('open'))

createCategoryElements(navBar);
createCategoryElements(drawerBar);
fetchNews()