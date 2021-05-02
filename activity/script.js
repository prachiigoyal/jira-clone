'use strict'
let colorBtn=document.querySelectorAll(".filter-color");
let mainContainer=document.querySelector(".main-container");
let bothElementArr=document.querySelectorAll(".icon-container")
let plusBtn=bothElementArr[0];
let crossBtn=bothElementArr[1];
let body=document.body;
let deleteState=false;
let arr=[];

if(localStorage.getItem("allTask")){
    let stringArr=localStorage.getItem("allTask");
    arr=JSON.parse(stringArr);
    for(let i=0;i<arr.length;i++){
        let {id,color,task}=arr[i];
        createTask(color,task,false,id)
    }
}
plusBtn.addEventListener("click",createModal);
crossBtn.addEventListener("click",setDeleteState);


// for(let i=0;i<colorBtn.length;i++){
// colorBtn[i].addEventListener("click",function(e){
//     let color=colorBtn[i].classList[1];
//     mainContainer.style.backgroundColor=color;
// })
// }
function createModal(){
    let modal_container=document.querySelector("modal-container");
    if(modal_container==null){
        modal_container=document.createElement("div");
        modal_container.setAttribute("class","modal-container");
    modal_container.innerHTML=(`
    <div class="modal-input-box">
        <textarea class="modal-input" placeholder="Enter your task"></textarea>
    </div>
    <div class="modal-filter-container">
        <div class="modal-filter pink"></div>
        <div class="modal-filter blue"></div>
        <div class="modal-filter green"></div>
        <div class="modal-filter black"></div>
    </div>
    </div>`)
    body.appendChild(modal_container);
    handleModal(modal_container);
    }
    let textarea=modal_container.querySelector(".modal-input");
    textarea.value="";
    }
    function handleModal(modal_container){
        let cColor="black";
        let modalFilters=document.querySelectorAll(".modal-filter");
        modalFilters[3].classList.add("border");
    for(let i =0;i<modalFilters.length;i++){
        modalFilters[i].addEventListener("click",function(){
            modalFilters.forEach((filter)=>{
                filter.classList.remove("border");
            })
            modalFilters[i].classList.add("border");
            cColor=modalFilters[i].classList[1];
            console.log("current color of the task is ",cColor);
        })
    }
    let textArea=document.querySelector(".modal-input");
    textArea.addEventListener("keydown",function(e){
        if(e.key=="Enter" && textArea.value!=""){
            console.log("Task ",textArea.value,"color ",cColor);
            modal_container.remove();
            createTask(cColor,textArea.value,true);
        }
    })
    }
    function createTask(color,task,flag,id){
        let task_container=document.createElement("div")
        let uifn=new ShortUniqueId();
        let uid= id || uifn();
        task_container.setAttribute("class","task-container");
        task_container.innerHTML=`
        <div class="task-filter ${color}"></div>
        <div class="task-desc-container"></div>
        <h3 class="uid">#${uid}</h3>
        <div class="task-desc" contenteditable="true">${task}</div>
    </div>`
    mainContainer.appendChild(task_container);
    let taskFilters=task_container.querySelector(".task-filter");
    if(flag==true){
        let obj={"task":task,"id":uid,"color":color}
        arr.push(obj);
        let finalArr=JSON.stringify(arr);
        localStorage.setItem("allTask",finalArr);
    }
    taskFilters.addEventListener("click",changeColor);
    task_container.addEventListener("click",deleteTask);
    let taskDesc=task_container.querySelector(".task-desc");
    taskDesc.addEventListener("keypress",editTask);
    }
    function changeColor(e){
        let taskFilter=e.currentTarget;
        let colors=['pink','blue','green','black'];
        let cColor=taskFilter.classList[1];
        let cColorIdx=colors.indexOf(cColor);
        let newColorIdx=(cColorIdx+1)%4;
        taskFilter.classList.remove(cColor);
        taskFilter.classList.add(colors[newColorIdx]);
    }

function setDeleteState(e){
    let crossBtn=e.currentTarget;
    if(deleteState==false){
        crossBtn.classList.add("active");
    }else{
        crossBtn.classList.remove("active");
    }
    deleteState=!deleteState;
}
function deleteTask(e){
    let task=e.currentTarget;
    if(deleteState){
        let uidElem=task.querySelector(".uid");
        let uid=uidElem.innerText.split("#")[1];
        for(let i=0;i<arr.length;i++){
            let {id}=arr[i];
            console.log(id,uid);
            if(id==uid){
                arr.splice(i,1);
                let finalTaskArr=JSON.stringify(arr);
                localStorage.setItem("allTask",finalTaskArr);
                task.remove();
                break;
            }
        }
    }
}
function editTask(e){
    let taskDesc=e.currentTarget;
    let uidElem=taskDesc.parentNode.children[0];
    let uid=uidElem.innerText.split("#")[1];
    for(let i=0;i<arr.length;i++){
        let {id}=arr[i];
        console.log(id,uid);
        if(id==uid){
            arr[i].task=taskDesc.innerText
            let finalTaskArr=JSON.stringify(arr);
            localStorage.setItem("allTask",finalTaskArr)
            break;
        }
    }
}