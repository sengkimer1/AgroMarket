const urlParams = new URLSearchParams(window.location.search);
const productId = Number(urlParams.get('productID'));
const categoryId = Number(urlParams.get('categoryID') )|| 1; // Use categoryId from URL or default to 1

const url = `https://grateful-nature-6f2f109031.strapiapp.com/api/products?populate=*&filters[categoryID]=${categoryId}&pagination[pageSize]=34`;
const apiToken = '92f04339632a6075e5b28c75730e0f4e99fcac7e3b4cc67d248e2f6b75abb555f25223169e8b2d32be07f10ee679cba66685eb869971bb27bd09f50d8eec95fd8d0c9f48e6022b3742007bca1c777847adfb09901d603cfed06f147277eb162a764cfd169182fef918b6cf1eb824efebd6f28010acc26dc14af547577858ecd0';

async function getApi() {
  try {
    const response = await fetch(url, {
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
    return result.data; // Assuming the products are under result.data
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

getApi()
  .then(data => {
    console.log(data);
    const cardContainer = document.getElementById('text-text-1');

    // Check if data array is not empty
    if (data && data.length > 0) {
      const product = data.find(p => p.id === productId); // Find the product with the given productId
      if (product) {
        const productLink = `../../pages/detail/index.html?productID=${product.id}&categoryID=${categoryId}`;
        cardContainer.innerHTML += `
          <div class="row mb-4">
            <div class="col-md-6">
              <a href="${productLink}">
                <div id="carouselExample${product.id}" class="carousel slide" data-bs-ride="carousel">
                  <div class="carousel-inner">
                    <div class="carousel-item active">
                      <img src="${product.attributes.images.data[0].attributes.url}" class="d-block w-100" alt="${product.attributes.Name}">
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <div class="col-md-6 paragrab">
              <h1>${product.attributes.Name}</h1>
              <p><strong>Price:</strong> $${product.attributes.Price} per kg</p>
              <p><strong>Quantity:</strong> ${product.attributes.Quantity}</p>
              <p><strong>Organic:</strong> ${product.attributes.Organic}</p>
              <p><strong>Origin Province:</strong> ${product.attributes.OriginProvince}</p>
              <h1 class="mt-4">Contact Information</h1>
              <div class="contact">
                <p><i class="fa fa-user"></i> Kimer SENG</p>
                <p><i class="fa fa-envelope"></i> kimer.seng@institute.pse.ngo</p>
                <p><i class="fa fa-phone"></i> +855 969 668 568</p>
              </div>
            </div>
          </div>
        `;
      } else {
        cardContainer.innerHTML = '<p>No product with the specified ID found.</p>';
      }
    } else {
      cardContainer.innerHTML = '<p>No products found.</p>';
    }
  })
  .catch(error => {
    console.error('Error getting products data:', error);
  });
