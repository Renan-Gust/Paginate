var data = Array.from({ length: 100 }) 
.map((_, i) => `Item ${(i + 1)}`)

//==========================================
var html = {
    get(element){
        return document.querySelector(element)
    }
}

var perPage = 5
var state = {
    page: 1,
    perPage,
    totalPage: Math.ceil(data.length / perPage),
    maxVisibleButtons: 5
}

var controls = {
    next() {
        state.page++

        var lastPage = state.page > state.totalPage
        if(lastPage){
            state.page--
        }
    },
    prev() {
        state.page--

        if(state.page < 1){
            state.page++
        }
    },
    goTo(page) {
        if(page < 1){
            page = 1
        }

        state.page = +page

        if(page > state.totalPage){
            state.page = state.totalPage
        }
    },
    createListeners(){
        html.get(".first").addEventListener("click", () => {
            controls.goTo(1)
            update()
        })

        html.get(".last").addEventListener("click", () => {
            controls.goTo(state.totalPage)
            update()
        })

        html.get(".next").addEventListener("click", () => {
            controls.next()
            update()
        })

        html.get(".prev").addEventListener("click", () => {
            controls.prev()
            update()
        })
    }
}

var list = {
    create(item) {
        var div = document.createElement("div")
        div.classList.add("item")
        div.innerHTML = item

        html.get(".list").appendChild(div)
    },
    update() {
        html.get(".list").innerHTML = ""

        var page = state.page - 1
        var start = page * state.perPage
        var end = start + state.perPage
        
        var paginatedItems = data.slice(start, end)

        paginatedItems.forEach(list.create)
    }
}

var buttons = {
    element: html.get(".controls .numbers"),
    create(number) {
        var button = document.createElement("div")

        button.innerHTML = number

        if(state.page == number){
            button.classList.add("active")
        }

        button.addEventListener("click", (event) => {
            var page = event.target.innerText

            controls.goTo(page)
            update()
        })

        buttons.element.appendChild(button)
    },
    update() {
        buttons.element.innerHTML = ""
        var {maxLeft, maxRight} = buttons.calculateMaxVisible()

        for(var page = maxLeft; page <= maxRight; page++){
            buttons.create(page)
        }

    },
    calculateMaxVisible() {
        var { maxVisibleButtons } = state
        var maxLeft = (state.page - Math.floor(maxVisibleButtons / 2))
        var maxRight = (state.page + Math.floor(maxVisibleButtons / 2))

        if(maxLeft < 1){
            maxLeft = 1
            maxRight = maxVisibleButtons
        }

        if(maxRight > state.totalPage){
            maxLeft = state.totalPage - (maxVisibleButtons - 1)
            maxRight = state.totalPage

            if(maxLeft < 1) maxLeft = 1
        }

        return {maxLeft, maxRight}
    }
}

function update(){
    list.update()
    buttons.update()
}

function init(){
    update()
    controls.createListeners()
}

init()


