let selectFile = document.querySelector("#uploadFile");
let newImg = document.querySelector("#prodImg");
let searchP = document.querySelector("#search");

selectFile.addEventListener("change", getImagePreview);
function getImagePreview() {
  let imageObject = selectFile.files[0]; // first file from files the user have selected
  if (imageObject) {
    newImg.style.display = "block";
    const reader = new FileReader();
    reader.addEventListener("load", function (e) {
      let bookImgObj = e.target.result;
      newImg.setAttribute("src", bookImgObj);
    });
    reader.readAsDataURL(imageObject); // read the binary files like images
  } else {
    newImg.style.display = "null";
    newImg.setAttribute("src", "");
  }
}

// validation function
function validation() {
  const pname = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  let pimage = document.getElementById("uploadFile").value;
  let imageObject = selectFile.files[0];
  if (pname == "") {
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "Enter Product Name!",
    });
    return false;
  }
  if (description == "") {
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "Enter Product Description!",
    });
    return false;
  }
  if (price == "") {
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "Enter Product Price!",
    });
    return false;
  }
  if (pimage == "") {
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "Enter Product image!",
    });
    return false;
  }
  if (imageObject.size >= 500000) {
    Swal.fire({
      icon: "error",
      title: "Failed to upload an image.",
      text: "The image maximum size is 500KB.!",
    });
    return false;
  }
  return true;
}

// function to show data
function showData() {
  let productdata; // create object
  if (localStorage.getItem("productdata") == null) {
    productdata = [];
  } else {
    productdata = JSON.parse(localStorage.getItem("productdata")); // local storage data to object
  }
  document.querySelector("#dataTable").innerHTML = "";
  // if the object has data then it will print it in table format
  productdata.forEach(function (element, index) {
    document.querySelector("#dataTable").innerHTML += `<tr class="text-center">
    <td>${index + 1}</td>
    <td>${element.name}</td>
    <td>${element.price} &#8377;</td>
    <td>${element.description}</td>
    <td class="d-flex justify-content-center"><a href="/view.html?id=${index}" class="view-btn"><span class="material-symbols-outlined"> 
    visibility
    </span></a><div onclick="deleteData(${index})" class="del-btn"><span class="material-symbols-outlined">delete</span></div></td>
    </tr>`;
  });
}
// function to loads all data to our document
showData();
// Function to store data
function addData() {
  const pname = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const image = document.getElementById("prodImg").src;
  // if form is validated
  if (validation() == true) {
    let productdata;
    if (localStorage.getItem("productdata") == null) {
      productdata = [];
    } else {
      productdata = JSON.parse(localStorage.getItem("productdata"));
    }
    productdata.push({
      name: pname,
      price: price,
      description: description,
      image: image,
    });
    localStorage.setItem("productdata", JSON.stringify(productdata));
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Data Added successfully",
      showConfirmButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        location.reload();
      }
    });
    showData();
    resetData();
  }
}

// reset all entered data
function resetData() {
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("description").value = "";
  document.getElementById("uploadFile").value = "";
  newImg.style.display = "null";
  newImg.setAttribute("src", "");
}

// deleting the data
function deleteData(index) {
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
      productdata.splice(index, 1);
      localStorage.setItem("productdata", JSON.stringify(productdata));
      showData();
      resetData();
      Swal.fire("Deleted!", "Your file has been deleted.", "success");
    }
  });
}

// Search product
searchP.addEventListener("input", searchProduct);
function searchProduct() {
  let dataTable = document.getElementById("dataTable");
  let tr = dataTable.querySelectorAll("TR");
  let filter = searchP.value.toLowerCase();
  for (let i = 0; i < tr.length; i++) {
    let product = tr[i].getElementsByTagName("TD")[1].innerHTML;
    let desc = tr[i].getElementsByTagName("TD")[2].innerHTML;
    let price = tr[i].getElementsByTagName("TD")[3].innerHTML;
    if (product.toLowerCase().indexOf(filter) > -1) {
      tr[i].style.display = "";
    } else if (desc.toLowerCase().indexOf(filter) > -1) {
      tr[i].style.display = "";
    } else if (price.toLowerCase().indexOf(filter) > -1) {
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }
  }
}

let table = document.querySelector("#sortTable");
let headers = table.querySelectorAll("TH");
let rows = table.querySelectorAll("TR");

headers.forEach((header, headerIndex) => {
  // sort data
  header.addEventListener("click", () => {
    // showData();
    sortColumn(headerIndex);
  });
});

let directions = Array(headers.length).fill("");
function sortColumn(headerIndex) {
  let tbody = document.getElementsByTagName("tbody");
  // check direction asc or desc
  let direction = directions[headerIndex] || "desc";
  let multiplier = direction == "asc" ? 1 : -1;
  changeIcon(direction, headerIndex);

  let arrayrows = Array.from(rows);
  arrayrows.shift(); // exclude table header

  let newrows = Array.from(arrayrows);
  newrows.sort(function (rowA, rowB) {
    const cellA = rowA.querySelectorAll("td")[headerIndex].innerHTML;
    const cellB = rowB.querySelectorAll("td")[headerIndex].innerHTML;
    let a = transform(headerIndex, cellA);
    let b = transform(headerIndex, cellB);

    if (a > b) return 1 * multiplier;
    else if (a < b) return -1 * multiplier;
    else return 0;
  });

  // remove the old rows
  rows.forEach((row, index) => {
    if (index != 0) {
      tbody[0].removeChild(row);
    }
  });

  // append new row
  newrows.forEach((newrow) => {
    tbody[0].appendChild(newrow);
  });

  // reverse the direction
  directions[headerIndex] = direction === "asc" ? "desc" : "asc";
}
// transform the content for sorting
const transform = function (index, content) {
  const type = headers[index].getAttribute("type");
  switch (type) {
    case "number":
      return parseFloat(content);
    case "string":
    default:
      return content;
  }
};

// change icon when sorting
function changeIcon(direction, index) {
  if (direction == "desc") {
    headers[index].childNodes[1].innerHTML = "";
    headers[
      index
    ].childNodes[1].innerHTML = `<span class="material-symbols-outlined">
    arrow_drop_down
  </span>`;
  } else {
    headers[index].childNodes[1].innerHTML = "";
    headers[
      index
    ].childNodes[1].innerHTML = `<span class="material-symbols-outlined">
    arrow_drop_up
  </span>`;
  }
}
