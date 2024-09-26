const api_url = "https://66d7160c006bfbe2e64fc526.mockapi.io/Todo_app";

function create_element(tagName,attributes,textContent){
    const element = document.createElement(tagName);
    for(let attribute in attributes){
        element.setAttribute(attribute,attributes[attribute]);
    }
    element.textContent=textContent;
    return element;

}
async function fetchandDisplay(element,filterText={status:"",priority:""}){
try{
    element.innerHTML = "";
    const res =await fetch(api_url);
    const todos = await res.json();
    todos.filter((todo)=>{
        if(filterText.status=="" && filterText.priority==""){
            return true;
        }
        if(filterText.status=="" && filterText.priority==todo.priority){
            return true;
        }
        if(filterText.status==todo.status && filterText.priority==""){
            return true;
        }
        if(filterText.status==todo.status && filterText.priority==todo.priority){
            return true;
        }
        return(
            filterText.status = todo.status && filterText.priority==todo.priority
        )
    }).forEach((todo) => {
    const todoRow = element.appendChild(create_element("tr",{class:"mx-auto text-center"}));
    todoRow.appendChild(create_element("td",{class:"bg-gray-200 p-3"},todo.id))
    todoRow.appendChild(create_element("td",{class:"bg-gray-200 p-3"},todo.taskname))
    todoRow.appendChild(create_element("td",{class:"bg-gray-200 p-3"},todo.deadline))
    todoRow.appendChild(create_element("td",{class:"bg-gray-200 p-3"},todo.priority))
    var status_td = todoRow.appendChild(create_element("td",{class:"bg-gray-200 p-3"}));
    var status_btn =  status_td.appendChild(create_element("button",{class: todo.status=="Pending" ? "text-red-400 hover:text-white hover:bg-red-500 rounded-lg" : todo.status == "Ongoing" ?  "text-yellow-400 hover:text-white hover:bg-yellow-500 rounded-lg":"text-green-400 hover:text-white hover:bg-green-700 rounded-lg"},todo.status));       
    const actionarea = todoRow.appendChild(create_element("td",{class:"bg-gray-200 p-3"}));
    const action_btn = actionarea.appendChild(create_element("button",{class:"px-4 py-2 bg-red-400 rounded-lg text-white"},"delete"));
    status_btn.addEventListener("click", async ()=>{
        const res  = await fetch(`${api_url}/${todo.id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                status : status_btn.textContent==="Pending"
                 ? "Ongoing" 
                 : status_btn.textContent === "Ongoing" 
                 ? "Completed" 
                 : "Pending",
            }), 
        });
        const updateTodo = await res.json();
        status_btn.textContent = updateTodo.status;
        status_btn.className = `${updateTodo.status === "Pending" ? "text-red-400 hover:text-white hover:bg-red-600 rounded-lg" : updateTodo.status === "Ongoing" ? "text-yellow-400 hover:text-white hover:bg-yellow-500 rounded-lg" : "text-green-400 hover:text-white hover:bg-green-500 rounded-lg"}`;    
    })
    action_btn.addEventListener("click", async () => {
        console.log("Delete button clicked!");
        try {
          const res = await fetch(`${api_url}/${todo.id}`, {
            method: "DELETE",
          });
          todoRow.remove();
        } catch (err) {
          console.log(err);
        }
      });
    });
}catch(err){
    console.warn(err);
}
 


}

window.onload = () => {
    const filterObject = {
        status :"",
        priority :""
    }
    const today = new Date().toISOString().split('T')[0];

    var nav = document.body.appendChild(create_element("nav", { class: "flex justify-around items-center h-24 bg-white shadow-lg mb-6"},));
    nav.appendChild(create_element("h1", { class: "logo text-5xl font-serif font-bold" }, "Todo App"));

    var div_ele = nav.appendChild(create_element("div", { class: "flex flex-row flex-nowrap justify-center gap-2" }));

    var task_ele = div_ele.appendChild(create_element("input", {
        type: "text",
        id: "todoname",
        placeholder: "Task?...",
        class: "date border border-gray-300 rounded-lg p-2 focus:outline-none focus-within:ring-2 focus:ring-violet-300 focus:border-violet-300"
    }));

    var select_ele = div_ele.appendChild(create_element("select", {
        name: "priority",
        id: "",
        class: "border border-gray-300 rounded-lg p-2 focus:outline-none focus-within:ring-2 focus:ring-violet-300 focus:border-violet-300"
    }, ""));
    select_ele.appendChild(create_element("option", { value: "default", disabled: true, selected: true }, "choose priority"));
    select_ele.appendChild(create_element("option", { value: "High" }, "High"));
    select_ele.appendChild(create_element("option", { value: "Medium" }, "Medium"));
    select_ele.appendChild(create_element("option", { value: "Low" }, "Low"));

    var deadlines_line = div_ele.appendChild(create_element("input", {
        type: "date",
        min: today,
        id: "deadlines",
        class: "border border-gray-300 rounded-lg p-2 focus:outline-none focus-within:ring-2 focus:ring-violet-300 focus:border-violet-300"
    }));

    var btn_ele = div_ele.appendChild(create_element("button", {
        class: "hover:ring-2 hover:ring-violet-500 active:bg-violet-500 hover:cursor-pointer hover:bg-violet-600 border px-4 py-2 bg-violet-400 rounded-lg text-white"
    }, "Add+"));


    btn_ele.addEventListener("click",async function addTodo() {
       
        if (task_ele.value === "" || select_ele.value === "default"||deadlines_line.value==="") {
            alert("Please enter the task name and choose a priority.");
            return;
        }

        
        const newTodo = {
            deadline: deadlines_line.value,
            taskname: task_ele.value,
            status: "pending",
            priority: select_ele.value
        };
        try{
            const res = await fetch(api_url,{
                method:"POST",
                headers:{
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify(newTodo)
                     
            }
            );
        
            const data = await res.json()
           await fetchandDisplay(tbody);
            
        }
        catch(err){
            console.warn(err);
        }
        finally{
            task_ele.value="";
            select_ele.value="";
            deadlines_line.value=""
        }
    });
    var filter_div = document.body.appendChild(create_element("div",{class:"md:flex md:flex-row md:flex-nowrap justify-center gap-2 grid grid-row-2 grid-col-2 m-2"}))
    var status_select = filter_div.appendChild(create_element("select", {
        name: "statusfilter",
        id: "statusfilter",
        class: "border border-gray-300 rounded-lg p-2 focus:outline-none focus-within:ring-2 focus:ring-violet-300 focus:border-violet-300"
    }, ""));
    status_select.appendChild(create_element("option", { value: "default", selected: true }, "All"));
    status_select.appendChild(create_element("option", { value: "Pending" }, "Pending"));
    status_select.appendChild(create_element("option", { value: "Ongoing" }, "Ongoing"));
    status_select.appendChild(create_element("option", { value: "Completed" }, "Completed"));
    status_select.addEventListener("change",()=>{
        filterObject.status =status_select.value;
        fetchandDisplay(tbody,filterObject)
    })
    const prioritySelectFilter = filter_div.appendChild(create_element("select",{class:"border-2 border-gray-300 focus: border-green-300 p-2 focus: outline-none rounded-1g focus: ring-2 focus: ring-green-300 hover:cursor-pointer"}))
    prioritySelectFilter.appendChild(create_element("option", { value: "default", selected: true }, "All"));
    prioritySelectFilter.appendChild(create_element("option", { value: "High" }, "High"));
    prioritySelectFilter.appendChild(create_element("option", { value: "Medium" }, "Medium"));
    prioritySelectFilter.appendChild(create_element("option", { value: "Low" }, "Low"));
    prioritySelectFilter.addEventListener("change",()=>{
        filterObject.priority =prioritySelectFilter.value;
        fetchandDisplay(tbody,filterObject)
    })
    var table = document.body.appendChild(create_element("table",{class:"w-full border shadow-lg"},));
    var thead = table.appendChild(create_element("thead",{class:"mx-auto text-center bg-violet-300"}));
    thead.appendChild(create_element("th",{class:"p-4"},"ID"));
    thead.appendChild(create_element("th",{class:"p-4"},"Todo Name"));
    thead.appendChild(create_element("th",{class:"p-4"},"DeadLine"));
    thead.appendChild(create_element("th",{class:"p-4"},"Priority"));
    thead.appendChild(create_element("th",{class:"p-4"},"Status"));
    thead.appendChild(create_element("th",{class:"p-4"},"Actions"));
    var tbody = table.appendChild(create_element("tbody",{class:"w-full"}));
    var tr = tbody.appendChild(create_element("tr",{class:"mx-auto text-center"}));
    fetchandDisplay(tbody);
}

