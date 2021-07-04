import { Component, OnInit } from '@angular/core';
import {Todo} from "../../models/Todo";
import {History} from "../../models/History";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../dialog/dialog.component";
import {DialogService} from "../../services/dialog.service";

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {
  todos:Todo[] = [];
  history:History[] = [];

  inputTodo:string = "";

  constructor(
    private dialogService: DialogService,
    private dialog: MatDialog){}

  openDialog(id: number) {
    const dialogRef = this.dialog.open(DialogComponent,{
      data:{
              message: 'enter new value, please!',
              buttonText: {
                ok: 'Save',
                cancel: 'No'
              }
            }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.editTodo(id)
      }
    });
  }


  editTodo (id:number){
    const elem = this.todos.filter((item, index)=> index == id);
    this.saveHistory('toggleComplete', elem);
    this.todos.map((item, index) =>{
      if (id == index){
        item.title = this.dialogService.newValue;
      }
    });
    this.saveLocal();
  }

  saveLocal = () =>{
    localStorage.setItem('todos',JSON.stringify(this.todos))
  };
  saveHistory = (method:string, item:object) =>{
    this.history.push({
      method: method,
      item: item
    });
    sessionStorage.setItem('history', JSON.stringify(this.history));
  };

  fetchTodos(){
    if((localStorage.getItem('todos') == null) || ((localStorage.getItem('todos')?.length) == 2) ) {
      console.log((localStorage.getItem('todos')?.length));
      this.todos = [];
      fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
        .then(response => response.json())
        .then(json => this.todos = json)
        .then( () => console.log(this.todos))
        .then(()=> this.saveLocal)
        .then(()=> console.log('fetched'))
    } else{
      this.todos = JSON.parse(localStorage.getItem('todos') || '{}');
      console.log('cashed');
    }
  };

  removeTodo (id: number){
    const elem = this.todos.filter((item, index)=> index == id);
    this.saveHistory('removeTodo', elem);
    this.todos = this.todos.filter((item, index) => index !== id);
    this.saveLocal();
  };

  toggleComplete(id: number){
    const elem = this.todos.filter((item, index)=> index == id);
    this.saveHistory('toggleComplete', elem);
    this.todos.map((item, index) =>{
      if (id == index){
        item.completed = !item.completed
      }
    });
    this.saveLocal();
  };

  addTodo(){
    console.log('fixed');
    console.log('added');
    if(this.inputTodo !=""){
      let elem = {
        userId: 1,
        id: Date.now(),
        title: this.inputTodo,
        completed: false
      };
      this.todos.push(elem);
      this.saveLocal();
      this.saveHistory('addTodo', elem);
    }
    this.inputTodo = "";
  }

  ngOnInit():void {
    console.log((localStorage.getItem('todos')));
     this.fetchTodos();
  };



}
