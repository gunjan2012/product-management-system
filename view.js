const url = window.location.search;
const urlparameter = new URLSearchParams(url);
const prodId = urlparameter.get("id");
const pname = document.querySelector("#productName");
const price = document.querySelector("#price");
const pdesc = document.querySelector("#productDesc");
const image = document.querySelector("#imgContainer");

// load data on product detail page
function dataload() {
  let productdata;
  if (localStorage.getItem("productdata") == null) {
    productdata = [];
  } else {
    productdata = JSON.parse(localStorage.getItem("productdata"));
  }
  pname.innerHTML = productdata[prodId].name;
  price.innerHTML = "&#8377; " + productdata[prodId].price;
  pdesc.innerHTML = productdata[prodId].description;
  image.src = productdata[prodId].image;
}
dataload();

// delete product
function deleteProduct() {
  let productdata;
  if (localStorage.getItem("productdata") == null) {
    productdata = [];
  } else {
    productdata = JSON.parse(localStorage.getItem("productdata"));
  }
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      productdata.splice(prodId, 1);
      localStorage.setItem("productdata", JSON.stringify(productdata));
      Swal.fire("Deleted!", "Your file has been deleted.", "success");
      document.location.href = "/index.html";
    }
  });
}

// target the modal and adding value by user
let updateModal = document.getElementById("Modal");
updateModal.addEventListener("show.bs.modal", function () {
  // take data from local storage
  let productdata;
  if (localStorage.getItem("productdata") == null) {
    productdata = [];
  } else {
    productdata = JSON.parse(localStorage.getItem("productdata"));
  }

  // Selecting each input field of updatemodal
  let pname = updateModal.querySelector("#name");
  let pdesc = updateModal.querySelector("#description");
  let pimg = updateModal.querySelector("#uploadFile");
  let previewimg = updateModal.querySelector("#previewImage");
  let price = updateModal.querySelector("#price");

  // add each field data from local storage
  pname.value = productdata[prodId].name;
  pdesc.value = productdata[prodId].description;
  previewimg.setAttribute("src", productdata[prodId].image);
  price.value = productdata[prodId].price;

  // select file to preview image
  pimg.addEventListener("change", getImagePreview);
  function getImagePreview() {
    let imageObject = pimg.files[0]; // first file from files the user have selected
    let newImg = document.getElementById("previewImage");
    if (imageObject) {
      // when image is selected load it in webpage
      const reader = new FileReader();
      reader.addEventListener("load", function (e) {
        let bookImgObj = e.target.result;
        newImg.src = bookImgObj;
      });
      reader.readAsDataURL(imageObject); // read the binary files like images
    } else {
      newImg.style.display = "null";
      newImg.setAttribute("src", " ");
    }
  }
});

// update data
function updateData() {
  // take entered value from modal
  let pname = updateModal.querySelector("#name");
  let pdesc = updateModal.querySelector("#description");
  let pimg = updateModal.querySelector("#previewImage");
  let price = updateModal.querySelector("#price");
  let imagefile = updateModal.querySelector("#uploadFile");
  let productdata;

  if (localStorage.getItem("productdata") == null) {
    productdata = [];
  } else {
    productdata = JSON.parse(localStorage.getItem("productdata"));
  }

  // Check any blank field value
  if (pname.value == "") {
    Swal.fire({
      position: "center",
      icon: "warning",
      title: "Enter Product Name",
    });
  } else if (pdesc.value == "") {
    Swal.fire({
      position: "center",
      icon: "warning",
      title: "Enter Product Description",
    });
  } else if (price.value == "") {
    Swal.fire({
      position: "center",
      icon: "warning",
      title: "Enter Price of Product",
    });
  } else {
    Swal.fire({
      position: "center",
      icon: "info",
      title:
        "No changes were made to the product details. Please make changes and try again.",
    });
  }
  // if data has changed then only update data
  if (
    pname.value != productdata[prodId].name ||
    pdesc.value != productdata[prodId].description ||
    price.value != productdata[prodId].price
  ) {
    productdata[prodId].name = pname.value;
    productdata[prodId].description = pdesc.value;
    productdata[prodId].price = price.value;
    localStorage.setItem("productdata", JSON.stringify(productdata));
    dataload();
    updateDataAlert();
  }
  // validation for selected file
  if (imagefile.files[0] != null) {
    if (imagefile.files[0].size >= 500000) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to upload an image.",
        text: "The maximum image size is 500KB.!",
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      });
    } else {
      productdata[prodId].image = pimg.src;
      localStorage.setItem("productdata", JSON.stringify(productdata));
      dataload();
      updateDataAlert();
    }
  }
}

// update data alert
function updateDataAlert() {
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Data Updated successfully",
    showConfirmButton: true,
  }).then((result) => {
    if (result.isConfirmed) {
      location.reload();
    }
  });
}
