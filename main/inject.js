
global_data = {}
nodes_for_work = null

function filterHomework(isClear){
    table = document.getElementsByClassName("table table-sm table-hover")[0]
    if(nodes_for_work == null){
        nodes_for_work = table.cloneNode(true)
    }else{

        table.insertAdjacentElement("afterend", nodes_for_work.cloneNode(true))
        table.remove()
    }

    table = document.getElementsByClassName("table table-sm table-hover")[0]

    for(var i=table.rows.length-1;i>=0;i--){
        var row = table.rows[i]
        var e = row.getElementsByTagName("td")
        if (e.length === 4){
            times = e[2].innerText
            scores = e[3].innerText
            // if (times.trim() === "None" || times.trim()==="Assessment closed." || scores.trim()==="Not started" || scores.trim()){


            if (scores.trim() === "Not started" && times.trim() !== "None" && times.trim().includes("starting from")) {
                e[2].innerHTML = "<span style='color: blue;font-weight: bold;'>Not started!</span>";
                if (!get_if_hidden("not_start")) {
                    continue;
                }
            } else if (times.trim() === "Assessment closed.") {
                e[2].innerHTML = "<span style='color: green;font-weight: bold;'>Closed!</span>";
                if (!get_if_hidden("finished")) {
                    continue;
                }
            } else if (times.trim() === "None") {
                e[2].innerHTML = "<span style='color: red;font-weight: bold;'>No need to complete!</span>";
                if (!get_if_hidden("no_need")) {
                    continue;
                }
            } else if (scores.trim() === "Score not shown") {
                e[2].insertAdjacentHTML("beforeend", "<span style='color: orange;font-weight: bold;'>In progress!</span>");
                if (!get_if_hidden("on_work")) {
                    continue;
                }
            } else {
                e[2].insertAdjacentHTML("beforeend", "<span style='color: darkmagenta;font-weight: bold;'>Needs completion!</span>");
                if (!get_if_hidden("need_work")) {
                    continue;
                }
            }


            if(isClear){
                        table.deleteRow(i)
                    }

            // }

        }
    }
}
function create_button(color,func,text){
    var buttons = document.createElement("button")
    buttons.textContent = text
    buttons.addEventListener("click",func)
    buttons.classList.add('btn','btn-primary', 'btn-sm')
    buttons.style.setProperty("float","right")
    buttons.style.setProperty("border","none")
    buttons.style.setProperty("background-color",color)
    buttons.style.setProperty("font-weight","bold")
    buttons.style.setProperty("margin-right","10px")
    return buttons
}

function create_checkbox(id,texts,func,ischecked=true){
    if(ischecked===undefined){
        ischecked = true
    }
    var doc = document.createElement("div")
    doc.style.setProperty("float","left")
    doc.style.setProperty("margin-right","10px")

    var input = document.createElement("input")
    input.type = "checkbox"
    input.id = id
    input.checked = ischecked
    input.addEventListener("change",func)
    var text = document.createElement("label")
    text.innerText = texts
    doc.append(input)
    doc.append(text)

    return doc
}
function get_if_hidden(key){
    if(global_data[key]!==undefined && global_data[key]===false){
        return false
    }
    return true
}

async function save_config(key, isHidden){
    data = global_data
    if(JSON.stringify(data)==="{}"){
        data = {}
    }
    data[key] = isHidden
    await chrome.storage.local.set({"jp_work_hidden_settings":data})
    global_data = data
}
get_config()
async function get_config(){
    data = await chrome.storage.local.get("jp_work_hidden_settings")
    console.log(data)
    if(data['jp_work_hidden_settings'] === undefined){
        data = {}
    }else{
        data = data['jp_work_hidden_settings']
    }
    console.log(JSON.stringify(data))
    if(JSON.stringify(data)==="{}"){
        data = {}
        data['on_work'] = false
        data['need_work'] = false
    }
    console.log(data)
    global_data = data



    inj = document.getElementsByClassName("card-header bg-primary text-white")
    n = inj[0].cloneNode()
    n.style.display = "none";
    n.id = "setting_panel";
    n.append(create_checkbox("hide_finished_work","Hide finished work",function (e){
        save_config("finished",e.target.checked)
    },global_data['finished']))
    n.append(create_checkbox("hide_not_start_work","Hide not start work",function (e){
        save_config("not_start",e.target.checked)
    },global_data['not_start']))
    n.append(create_checkbox("hide_no_need_work","hide no need work",function (e){
        save_config("no_need",e.target.checked)
    },global_data['no_need']))
    n.append(create_checkbox("hide_on_work_work","hide on work work",function (e){
        save_config("on_work",e.target.checked)
    },global_data['on_work']))
    n.append(create_checkbox("hide_need_work_work","hide need work work",function (e){
        save_config("need_work",e.target.checked)
    },global_data['need_work']))
    inj[0].insertAdjacentElement("afterend",n)
    inj[0].style.setProperty("background-color","#f27474","important")
    filter_button = create_button("#FFC0CB",function (){
        filterHomework(true)
    },"Filter all work");
    setting_button = create_button("#FFC0CB",function (){
        open_setting(true)
    },"Setting");
    inj[0].append(filter_button)
    inj[0].append(setting_button)

    filterHomework(true)
}
async function open_setting(n){
    var onode = document.getElementById("setting_panel");
    if (onode.style.display==="none"){
        onode.style.display = "block"
    }else{
        onode.style.display = "none"

    }

}






