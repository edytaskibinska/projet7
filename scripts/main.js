const ingredientsList = document.querySelector(".sugIngredents");
const ustensilsList = document.querySelector(".sugUstensils");
const appareilsList = document.querySelector(".sugApareils");
const search = document.querySelector(".search");

async function getData() {
  const response = await fetch("./data/recipes.json");
  const datas = await response.json();
  return datas;
}

const tagsContainer = document.querySelector(".tags");
async function createTag(arr, element) {
  const { recipes } = await getData();

  arr.map((item) => {
    domElement = document.createElement("div");
    domElement.setAttribute("class", "tag");
    domElement.textContent = item;
    domElement.addEventListener("click", (event) => {
      filterTaglistByName(recipes, event, inpIngred);
    });
    element.appendChild(domElement);
    domElement.addEventListener("click", (event) => {
      createTagJelly(event);
    });
  });
}

const inpIngred = document.querySelector(".recipes");

const createDom = (arr) => {
  const block = document.createElement("div");
  const desc = document.createElement("div");
  const titleBlock = document.createElement("div");
  const title = document.createElement("h4");
  const timer = document.createElement("span");
  const timerBlock = document.createElement("span");
  timerBlock.setAttribute("class", "timerBlock");
  const clock = document.createElement("i");
  clock.setAttribute("class", "fa-regular fa-clock");

  const descriptionBlock = document.createElement("div");
  descriptionBlock.setAttribute("class", "descBlock");
  timerBlock.appendChild(clock);
  timerBlock.appendChild(timer);
  const ingredients = document.createElement("ul");
  const recipeDesc = document.createElement("div");

  arr.ingredients.map((ingredient) => {
    const listeEleme = document.createElement("li");

    const ingr = document.createElement("span");
    const quantity = document.createElement("span");
    const qty = ingredient?.quantity ?? "";
    const units = ingredient?.unit ?? "";
    quantity.textContent = `${qty} ${units}`;
    ingr.textContent = ingredient?.ingredient;
    listeEleme.appendChild(ingr);
    listeEleme.appendChild(quantity);
    ingredients.appendChild(listeEleme);
  });
  descriptionBlock.appendChild(ingredients);
  descriptionBlock.appendChild(recipeDesc);

  recipeDesc.textContent = arr.description;
  title.textContent = arr.name;
  timer.textContent = `${arr.time} min`;

  titleBlock.appendChild(title);
  titleBlock.appendChild(timerBlock);
  block.setAttribute("class", "recip");
  titleBlock.setAttribute("class", "titleBlock");
  desc.setAttribute("class", "desc");

  desc.appendChild(titleBlock);
  desc.appendChild(descriptionBlock);
  block.appendChild(desc);
  inpIngred.appendChild(block);
};

const generateIngredientsList = (array) => {
  const inputIngredients = array.map((item) => item.ingredients);
  const flatternArray = inputIngredients.flat(1);
  let outputIngredients = flatternArray.map((item) => item.ingredient);
  let newIngredientsList = [...new Set(outputIngredients)];
  return newIngredientsList;
};

const generateAppareilsList = (array) => {
  const inputAppareils = array.map((item) => item.appliance);
  let newAppareilsList = [...new Set(inputAppareils)];
  return newAppareilsList;
};
const generateUstensilsList = (array) => {
  const inputUstensils = array.map((item) => item.ustensils);
  const flatternUst = inputUstensils.flat(1);
  let newUstensilsList = [...new Set(flatternUst)];
  return newUstensilsList;
};

const tagListFiltering = (elem, list) => {
  elem.forEach((element) => {
    const compareElement = element.querySelector(".tagText");
    if (
      list.includes(compareElement.textContent) ||
      list.includes(compareElement.textContent.toLowerCase())
    ) {
      return;
    } else {
      compareElement.parentNode.remove();
    }
  });
};

const filterRecipe = (arr, e, domElement) => {
  let newArrayRecipes = [];

  if (search.value == "") {
    domElement.innerHTML = "";
    arr.map((recipe) => createDom(recipe));
  }
  if (e.target.value.length > 2) {
    for (let element of arr) {
      const conditionIngred = element.ingredients;
      let newArr = [];
      conditionIngred.map((ing) => {
        newArr.push(ing.ingredient);
      });
      let conditionIng = newArr.some((name) => {
        if (name.toLowerCase().includes(e.target.value.toLowerCase())) {
          return true;
        }
      });

      const condition =
        conditionIng ||
        element?.name.toLowerCase().includes(e.target.value?.toLowerCase()) ||
        element?.description
          .toLowerCase()
          .includes(e.target.value?.toLowerCase());
      if (condition) {
        if (newArrayRecipes.includes(element)) {
          return;
        } else {
          newArrayRecipes.push(element);
        }
      }
    }

    const newTagsIngr = generateIngredientsList(newArrayRecipes);
    ingredientsList.innerHTML = "";
    createTag(newTagsIngr, ingredientsList);
    appareilsList.innerHTML = "";
    const newAppList = generateAppareilsList(newArrayRecipes);
    createTag(newAppList, appareilsList);
    ustensilsList.innerHTML = "";
    const newUstList = generateUstensilsList(newArrayRecipes);
    createTag(newUstList, ustensilsList);

    domElement.innerHTML = "";
    newArrayRecipes.map((recipe) => createDom(recipe));

    const ingrTags = document.querySelectorAll(".jellyTag.ingr");
    const appTags = document.querySelectorAll(".jellyTag.appar");
    const ustTags = document.querySelectorAll(".jellyTag.ust");
    tagListFiltering(ingrTags, newTagsIngr);
    tagListFiltering(appTags, newAppList);
    tagListFiltering(ustTags, newUstList);
  } else {
    newArrayRecipes = [];
    domElement.innerHTML = "";
    arr.map((recipe) => createDom(recipe));
    const allRecipes = generateIngredientsList(arr);
    const allAppareils = generateAppareilsList(arr);
    const allUstensilss = generateUstensilsList(arr);
    ingredientsList.innerHTML = "";
    createTag(allRecipes, ingredientsList);
    appareilsList.innerHTML = "";
    createTag(allAppareils, appareilsList);
    ustensilsList.innerHTML = "";
    createTag(allUstensilss, ustensilsList);
  }
};
const filterTaglistByName = (arr, e, domElement) => {
  const newArray = [];
  for (let element of arr) {
    const condition =
      element?.name
        .toLowerCase()
        .includes(e.target?.textContent.toLowerCase()) ||
      element?.description
        .toLowerCase()
        .includes(e.target?.textContent.toLowerCase());
    if (condition) {
      if (newArray.includes(element)) {
        return;
      } else {
        newArray.push(element);
      }
    }
  }
  domElement.innerHTML = "";
  newArray.map((recipe) => createDom(recipe));
};

async function filterRecipeByTag(arr, e, domElement) {
  const { recipes } = await getData();

  let compareArray = [];
  const tagText = document.querySelectorAll(".tagText");
  if (tagText.length == 0) {
    domElement.innerHTML = "";
    return recipes.map((recipe) => createDom(recipe));
  }
  tagText.forEach((element) => {
    compareArray.push(element.textContent);
  });
  let newArray = [];
  compareArray.forEach((elem) => {
    for (let element of arr) {
      const condition =
        element?.name.toLowerCase().includes(elem.toLowerCase()) ||
        element?.description.toLowerCase().includes(elem.toLowerCase());
      if (condition) {
        if (newArray.includes(element)) {
          return;
        } else {
          newArray.push(element);
        }
      }
    }
  });

  domElement.innerHTML = "";
  newArray.map((recipe) => createDom(recipe));
}
let tagList = [];

async function createTagJelly(event) {
  const { recipes } = await getData();
  let tagColor = "";
  if (event.target.closest(".sugIngredents")) {
    tagColor = "ingr";
  }
  if (event.target.closest(".sugApareils")) {
    tagColor = "appar";
  }
  if (event.target.closest(".sugUstensils")) {
    tagColor = "ust";
  }

  let newListElement = {};

  if (tagList.some((e) => e.tagText === event.target.textContent)) {
    return false;
  } else {
    newListElement = {
      tagColor: tagColor,
      tagText: event.target.textContent,
    };
    tagList = [...tagList, newListElement];
  }

  tagText = document.createElement("span");
  tagElement = document.createElement("div");
  closeElement = document.createElement("a");
  closeElement.setAttribute("class", "close");
  closeIcon = document.createElement("i");
  closeIcon.setAttribute("class", "fa-regular fa-circle-xmark");
  tagText.setAttribute("class", "tagText");
  closeElement.appendChild(closeIcon);
  tagElement.appendChild(tagText);
  tagElement.appendChild(closeElement);
  tagElement.setAttribute("class", "jellyTag");

  tagElement.classList.add(newListElement.tagColor);
  tagText.textContent = newListElement.tagText;

  tagsContainer.appendChild(tagElement);

  const closeX = document.querySelectorAll(".close");
  closeX.forEach((element) => {
    element.addEventListener("click", (event) => {
      element.closest(".jellyTag").remove();
      filterRecipeByTag(recipes, event, inpIngred);
    });
  });

  filterRecipeByTag(recipes, event, inpIngred);
}

const filterTag = (arr, e, domElement) => {
  if (e.target.value == "") {
    domElement.innerHTML = "";
    createTag(arr, domElement);
  }
  const filteredAraray = arr.filter((element) =>
    element.toLowerCase().includes(e.target.value.toLowerCase())
  );
  domElement.innerHTML = "";
  createTag(filteredAraray, domElement);
};

const inpIngredients = document.querySelector("input.ingredients");
const inpAppareils = document.querySelector("input.appareils");
const inpUstensils = document.querySelector("input.ustensils");
const dropdownIngr = document.querySelector(".ingr");
const dropdownUst = document.querySelector(".ust");
const dropdownApp = document.querySelector(".appar");
async function filters() {
  const { recipes } = await getData();
  if (recipes) {
    //ingredients code
    const ingrArray = generateIngredientsList(recipes);
    createTag(ingrArray, ingredientsList);
    const arrowOnList = document.querySelectorAll(".arrowClick");
    arrowOnList.forEach((element) => {
      element.addEventListener("click", (event) => {
        if (element.closest(".dropdown").classList.contains("open")) {
          element.closest(".dropdown").classList.remove("open");
        } else {
          element.closest(".dropdown").classList.add("open");
        }
      });
    });
    inpIngredients.addEventListener("input", (event) => {
      dropdownIngr.classList.add("open");
      if (inpIngredients.value == "") {
        dropdownIngr.classList.remove("open");
      }
      filterTag(ingrArray, event, ingredientsList);
    });

    //ustensils code
    const newUstList = generateUstensilsList(recipes);
    createTag(newUstList, ustensilsList);
    inpUstensils.addEventListener("input", (event) => {
      dropdownUst.classList.add("open");
      if (inpUstensils.value == "") {
        dropdownUst.classList.remove("open");
      }
      filterTag(newUstList, event, ustensilsList);
    });
    //appareils
    const newAppList = generateAppareilsList(recipes);
    createTag(newAppList, appareilsList);
    inpAppareils.addEventListener("input", (event) => {
      dropdownApp.classList.add("open");
      if (inpAppareils.value == "") {
        dropdownApp.classList.remove("open");
      }
      filterTag(newAppList, event, appareilsList);
    });
  }
}

async function recipes() {
  const { recipes } = await getData();
  if (recipes) {
    recipes.map((recipe) => createDom(recipe));
    search.addEventListener("input", (event) => {
      filterRecipe(recipes, event, inpIngred);
      if (!inpIngred.childNodes.length) {
        const noElements = document.createElement("div");
        noElements.setAttribute("class", "noElements");
        noElements.textContent =
          " Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.";
        inpIngred.appendChild(noElements);
      }
    });
  }
}

recipes();
filters();
