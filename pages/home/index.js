const apiToken = '92f04339632a6075e5b28c75730e0f4e99fcac7e3b4cc67d248e2f6b75abb555f25223169e8b2d32be07f10ee679cba66685eb869971bb27bd09f50d8eec95fd8d0c9f48e6022b3742007bca1c777847adfb09901d603cfed06f147277eb162a764cfd169182fef918b6cf1eb824efebd6f28010acc26dc14af547577858ecd0';

async function getApi(categoryId) {
  const apiUrl = `https://grateful-nature-6f2f109031.strapiapp.com/api/products?populate=*&filters[categoryID]=${categoryId}&pagination[pageSize]=6`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    return result.data; 
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

function renderProducts(categoryId, containerId) {
  getApi(categoryId)
    .then(data => {
      console.log('Products data:', data);
      const cardContainer = document.getElementById(containerId);
      if (!cardContainer) {
        console.error(`Element with id "${containerId}" not found.`);
        return;
      }
      
      cardContainer.innerHTML = '';  // Clear existing content
      
      data.forEach(product => {
        const attributes = product.attributes;
        const imageUrl = attributes.images?.data[0]?.attributes?.url || 'default-image-url.jpg';
        const productLink = `../../pages/detail/index.html?productID=${product.id}&categoryID=${categoryId || ''}`;

        cardContainer.innerHTML += `
        <a href="${productLink}">
          <div class="card-container">

              <div class="row">
                <div class="col-md-4">
                  <div class="card position-relative">
                   
                      <img src="${imageUrl}" class="card-img-top" alt="${attributes.Name}">
                    
                    <div class="card-body">
                      <h5 class="card-title">${attributes.Name}</h5>
                      <p class="badge organic-badge" class="card-text">${attributes.Organic ? 'Organic' : ''}</p>
                      <p   class="card-text">Quantity: ${attributes.Quantity}</p>
                      <p class="card-text">Price: $${attributes.Price} per kg</p>
                      <p class="card-text">Province: ${attributes.OriginProvince}</p>
                    </div>
                  </div>
                </div>
              </div>
            
          </div>
          </a>
        `;
      });
    })
    .catch(error => {
      console.error('Error getting products data:', error);
    });
}

// Fetch products for categoryID 1
renderProducts(1, 'text-text-1');

// Fetch products for categoryID 2
renderProducts(2, 'text-text-2');

// Fetch products for categoryID 3
renderProducts(3, 'text-text-3');

// Fetch products for categoryID 4
renderProducts(4, 'text-text-4');
