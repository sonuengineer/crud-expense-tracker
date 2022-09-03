const submitButton = document.getElementById("submit");
const apiendpoint = "https://crudcrud.com/api/3d9abd23494248618e53804302322baa";
var idCurrentlyEditing = "";
var isEditing = false;
var currentselectedelement = {};

if (document.readyState !== "loading") {
    async function getUserData() {
      await axios.get(`${apiendpoint}/expensetracker`).then((data) => {
        for (let i = 0; i < data.data.length; i++) {
          console.log("creating ", data.data[i]);
          addNewLineElement(data.data[i]);
        }
      });
    }
    getUserData();
  }

  submitButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const type = document.getElementById("type").value;
    const name = document.getElementById("name").value;
    const amount = document.getElementById("amount").value;
    if ( name.length > 0) {
      var object = {
        name: name,
        type:type,
        amount:amount //unique
      };

      if (isEditing) {
        axios
          .put(`${apiendpoint}/expensetracker/${idCurrentlyEditing}`, object)
          .then((data) => {
            // .removeChild(li);
            const ul = document.getElementById("listOfPeople");
            ul.removeChild(currentselectedelement);
            addNewLineElement({ ...object, _id: idCurrentlyEditing });
          })
          .catch((err) => {
            const errorspan = document.createElement("span");
            errorspan.appendChild(
              document.createTextNode("Retry...")
            );
            errorspan.style.color = "red";
            currentselectedelement.appendChild(errorspan);
            setTimeout(() => {
              currentselectedelement.removeChild(errorspan);
            }, 3000);
          });
        isEditing = false;
      } else {
        const response = await axios.post(`${apiendpoint}/expensetracker`, object);
  
        addNewLineElement(response.data);
      }
    }
  });


  function addNewLineElement(object) {
  const ul = document.getElementById("listOfPeople");
  const li = document.createElement("li");
  li.appendChild(
    document.createTextNode(object.name + " " + object.type + " "+object.amount+" ")
  );

  const deletebutton = document.createElement("input");
  deletebutton.type = "button";
  deletebutton.value = "delete";
  deletebutton.addEventListener("click", () => {
    axios
      .delete(`${apiendpoint}/expensetracker/${object._id}`)
      .then((data) => {
        // throw new Error();
        ul.removeChild(li);
      })
      .catch((err) => {
        const errorspan = document.createElement("span");
        errorspan.appendChild(
          document.createTextNode(" Retry...")
        );
        errorspan.style.color = "red";
        li.appendChild(errorspan);
        setTimeout(() => {
          li.removeChild(errorspan);
        }, 3000);
      });
  });

  deletebutton.className = "delete";
  deletebutton.style.border = "2px solid red";
  li.appendChild(deletebutton);

  const editbutton = document.createElement("input");
  editbutton.type = "button";
  editbutton.value = "Edit";
  editbutton.addEventListener("click", () => {
    isEditing = true;
    idCurrentlyEditing = object._id;
    currentselectedelement = li;
    document.getElementById("name").value = object.name;
    document.getElementById("type").value = object.type;
    document.getElementById("amount").value = object.amount;
  });
  editbutton.style.border = "2px solid green";
  li.appendChild(editbutton);

  ul.appendChild(li);
}
