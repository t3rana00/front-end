import { Task } from "./Task.js"

class Todos {
    #tasks = []
    #backend_url = ''

    constructor(url) {
        this.#backend_url = url
    }

    // add method to get tasks
    getTasks = () => {
        return new Promise(async(resolve, reject) => {
            fetch(this.#backend_url)
            .then(response => response.json())
            .then((json) => {
                this.#readJson(json)
                resolve(this.#tasks)
            }, (error) => {
                reject(error)
            })

        })
    }

    // add method to add task
    addTask = (text) => {
        return new Promise(async(resolve, reject) => {
            const json = JSON.stringify({ description: text })
            fetch(this.#backend_url + '/new', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: json
            })
            .then(response => response.json())
            .then((json) => {
                resolve(this.#addToArray(json.id, text))
            }, (error) => {
                reject(error)
            })
        })
    }

    // add method to remove task
    removeTask = (id) => {
        return new Promise(async(resolve, reject) => {
            fetch(this.#backend_url + '/delete/' + id, {
                method: 'delete'
            })
            .then((response) => response.json())
            .then((json) => {
                this.#removeFromArray(id)
                resolve(json.id)
            },(error) => {
                reject(error)
            })
        })
    }

    // add method to update task
    #readJson = (tasksAsJson) => {
        tasksAsJson.forEach(node => {
            const task = new Task(node.id, node.description)
            this.#tasks.push(task)
        })
    }

    // add method to add task
    #addToArray = (id,text) => {
        const task = new Task(id, text)
        this.#tasks.push(task)
        return task
    }

    // add method to remove task
    #removeFromArray = (id) => {
        const arrayWithoutRemoved = this.#tasks.filter(task => task.id !== id)
        this.#tasks = arrayWithoutRemoved
    }
} 

export { Todos }
