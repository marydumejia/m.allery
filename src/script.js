const imageContainer = document.getElementById('image-container')
const imageFile = document.getElementById('img-pic')
const imageAdd = document.getElementById('add-img')
const contentTable = document.getElementById('content-choose')
const introText = document.getElementById('intro-text')

const imageTitle = document.getElementById('img-title')
const imageUrl = document.getElementById('img-url')
const imageDescrip = document.getElementById('img-descrip')
const uploadImg = document.getElementById('upload-img')
const uploadUrl = document.getElementById('upload-url')

const beforeButton = document.getElementById('before-button');
const afterButton = document.getElementById('after-button');

uploadImg.addEventListener('click', () => {
    contentTable.classList.remove('hidden');
    introText.classList.add('hidden');
})

uploadUrl.addEventListener('click', ()=>{
    contentTable.classList.remove('hidden');
    imageUrl.classList.remove('hidden');
    imageFile.parentElement.classList.add('hidden');
    introText.classList.add('hidden');
})

beforeButton.addEventListener('click', () => {
    const currentPage = getCurrentPage();
    if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
    }
});

function getCurrentPage () {
    const query = location.href.split('?')[1];
    return query ? Number(query.split('=')[1]) : 1;
}

function setCurrentPage (page) {
    location.href = `?page=${page}`;
}

afterButton.addEventListener('click', () => {
    const currentPage = getCurrentPage();
    const pages = Math.ceil(getLocalImages().length / 3);
    if (currentPage < pages) {
        setCurrentPage(currentPage + 1);
    }
});

imageAdd.addEventListener('click', async () => {
    const title = imageTitle.value;
    const file = imageFile.files[0];
    const url = imageUrl.value;

    if (!title || (!file && !url)) {
        alert('please fill all fields :)');
        return;
    }

    const image = { title };
    if (file) image.url = await getDataURL(file);
    else if (url) image.url = url;

    const images = getLocalImages();
    images.push(image);
    setLocalImages(images);

    cleanInputs();
    clearContainer(imageContainer);
    createImages(images, imageContainer);
});

function getLocalImages () {
    return JSON.parse(localStorage.getItem('gallery')) || [];
}

function setLocalImages (images) {
    localStorage.setItem('gallery', JSON.stringify(images));
}

function cleanInputs () {
    imageFile.value = '';
    imageUrl.value = '';
    imageTitle.value = '';
}

function clearContainer (container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

function createImages (images,container) {
    const sliced = slicedImages(images, getCurrentPage());
    sliced.forEach(image => {
        const div = document.createElement('div');
        const img = document.createElement('img');
        const title = document.createElement('h3');
        const descrip = document.createElement('h1');

        div.className = 'w-full h-auto cursor-pointer';

        img.src = image.url;
        img.alt = image.title;
        img.title = image.title;
        img.descrip = image.descrip;
        img.className = 'w-full h-64 object-cover rounded-lg hover:h-[22rem] transition-[height] ease-in-out';

        title.innerText = image.title;
        descrip.innerText = image.descrip;
        title.className = 'text-center text-2xl text-gray-800';

        div.appendChild(img);
        div.appendChild(title);
        div.appendChild(descrip);
        container.appendChild(div);
    });
}

function slicedImages (images, page) {
    const start = (page - 1) * 3;
    const end = page * 3;
    return images.slice(start, end);
}

function getDataURL (file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const image = new Image();
            image.onload = () => {
                resolve(resizeImage(image, file.type));
            };
            image.src = reader.result.toString();
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

function resizeImage (image, imageType) {
    const MAX_WIDTH = 600;
    const MAX_HEIGHT = 400;

    const ratio = Math.min(MAX_WIDTH / image.width, MAX_HEIGHT / image.height);
    const width = image.width * ratio;
    const height = image.height * ratio;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);

    return canvas.toDataURL(imageType);
}