// Get URL parameters
const params = new URLSearchParams(window.location.search);
const categoryId = params.get('CategoryID');

const apiToken = '92f04339632a6075e5b28c75730e0f4e99fcac7e3b4cc67d248e2f6b75abb555f25223169e8b2d32be07f10ee679cba66685eb869971bb27bd09f50d8eec95fd8d0c9f48e6022b3742007bca1c777847adfb09901d603cfed06f147277eb162a764cfd169182fef918b6cf1eb824efebd6f28010acc26dc14af547577858ecd0';

async function getApi(categoryId) {
  let apiUrl = `https://grateful-nature-6f2f109031.strapiapp.com/api/products?populate=*&pagination[pageSize]=34`;
  
  if (categoryId) {
    apiUrl += `&filters[categoryID]=${categoryId}`;
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

function createProductCard(product) {
  const attributes = product.attributes;
  const imageUrl = attributes.images?.data?.[0]?.attributes?.url || 'default-image-url.jpg';
  const productLink = `../../pages/detail/index.html?productID=${product.id}&categoryID=${categoryId || ''}`;

  return `
  <a href="${productLink}" style="text-decoration: none;">
    <div class="opject">
     
        <img src="${imageUrl}" alt="${attributes.Name}">
      
      <div class="word">
        <h5>${attributes.Name}</h5>   
        <p class="card-text">Quantity: ${attributes.Quantity}</p>
        <p class="card-text">Price: $${attributes.Price} per kg</p>
        <p class="card-text">Province: ${attributes.OriginProvince}</p>
      </div>
    </div>
    </a>
  `;
}

async function renderProducts(containerId, categoryId = null) {
  const cardContainer = document.getElementById(containerId);
  if (!cardContainer) {
    console.error(`Element with id "${containerId}" not found.`);
    return;
  }

  cardContainer.innerHTML = '<p>Loading...</p>';

  try {
    const data = await getApi(categoryId);
    cardContainer.innerHTML = ''; 
    if (data.length === 0) {
      cardContainer.innerHTML = '<p>No products found.</p>';
    } else {
      data.forEach(product => {
        cardContainer.innerHTML += createProductCard(product);
      });
    }
  } catch (error) {
    cardContainer.innerHTML = '<p>Error loading products. Please try again later.</p>';
  }
}

// Call renderProducts with categoryId if present, otherwise fetch all products
renderProducts('products-container', categoryId);
