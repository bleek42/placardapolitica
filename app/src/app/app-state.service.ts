import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppStateService {
    // https://morioh.com/p/3581908a5bea

    private readonly _user = new BehaviorSubject(localStorage.authToken ? { authToken: localStorage.authToken } : null);
    readonly user$ = this._user.asObservable();
    // .pipe(
    //     /** shareReplay does two things, caches the last emitted value, 
    //         so components that subscribe after a value been emitted can still display the value,
    //         and shares the same observable between all observers, 
    //         instead of creating new observables on each subscription
    //     */
    //     shareReplay(1) 
    //   );
    get user() {
        return this._user.getValue();
    }
    set user(val) {
        this._user.next(val);
    }

    getUserObject() {
        const auth = this._user.getValue();
        if (auth) {
            try {
                return JSON.parse(atob(localStorage.authToken.split('.')[1]));
            } catch (e) {
                return
            }
        }
    }

    private readonly _board = new BehaviorSubject(null);
    readonly board$ = this._board.asObservable();
    get board() {
        return this._board.getValue();
    }
    set board(val) {
        this._board.next(val);
    }

    // - We set the initial state in BehaviorSubject's constructor
    // - Nobody outside the Store should have access to the BehaviorSubject 
    //   because it has the write rights
    // - Writing to state should be handled by specialized Store methods (ex: addTodo, removeTodo, etc)
    // - Create one BehaviorSubject per store entity, for example if you have TodoGroups
    //   create a new BehaviorSubject for it, as well as the observable$, and getters/setters
    //   private readonly _todos = new BehaviorSubject<Todo[]>([]);

    //   // Expose the observable$ part of the _todos subject (read only stream)
    //   readonly todos$ = this._todos.asObservable();


    //   // the getter will return the last value emitted in _todos subject
    //   get todos(): Todo[] {
    //     return this._todos.getValue();
    //   }


    //   // assigning a value to this.todos will push it onto the observable 
    //   // and down to all of its subsribers (ex: this.todos = [])
    //   private set todos(val: Todo[]) {
    //     this._todos.next(val);
    //   }

    //   addTodo(title: string) {
    //     // we assaign a new copy of todos by adding a new todo to it 
    //     // with automatically assigned ID ( don't do this at home, use uuid() )
    //     this.todos = [
    //       ...this.todos, 
    //       {id: this.todos.length + 1, title, isCompleted: false}
    //     ];
    //   }

    //   removeTodo(id: number) {
    //     this.todos = this.todos.filter(todo => todo.id !== id);
    //   }


}