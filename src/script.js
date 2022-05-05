const imageContainer = document.getElementById('image-container')
const imageFile = document.getElementById('img-pic')
const imageAdd = document.getElementById('add-img')
const contentTable = document.getElementById('content-choose')

const imageTitle = document.getElementById('img-title')
const imageUrl = document.getElementById('img-url')
const imageDescrip = document.getElementById('img-descrip')
const uploadImg = document.getElementById('upload-img')
const uploadUrl = document.getElementById('upload-url')

const beforeButton = document.getElementById('before-button');
const afterButton = document.getElementById('after-button');

uploadImg.addEventListener('click', () => {
    contentTable.parentElement.classList.remove('hidden');
})

uploadUrl.addEventListener('click', ()=>{
    contentTable.parentElement.classList.remove('hidden');
    imageUrl.classList.remove('hidden');
    imageFile.classList.add('hidden');
})

beforeButton.addEventListener('click', () => {
    const currentPage = getCurrentPage();
    if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
    }
});

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
    createPages(images, getCurrentPage());
});

