import {
  Component,
  signal,
  computed,
  effect,
  inject,
  Injector,
} from '@angular/core';
import { Task } from '../../modules/util';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  tasks = signal<Task[]>([
    {
      id: 1,
      task: 'first one',
      completed: false,
    },
    {
      id: 2,
      task: 'sec one',
      completed: false,
    },
    {
      id: 3,
      task: 'third one',
      completed: false,
    },
  ]);

  filter = signal<'all' | 'pending' | 'completed'>('all');

  injector = inject(Injector);

  ngOnInit() {
    let storage = localStorage.getItem('tasks');
    if (storage) {
      let tasks1 = JSON.parse(storage);
      this.tasks.set(tasks1);
    }
    this.trackTasks();
  }

  trackTasks() {
    effect(
      () => {
        let tasks = this.tasks();

        localStorage.setItem('tasks', JSON.stringify(tasks));
      },
      { injector: this.injector }
    );
  }

  taskByFilter = computed(() => {
    //aca se coloca lo que queremos que 'reaccione'
    const tasks = this.tasks();
    const filter = this.filter();

    if (filter === 'pending') {
      return tasks.filter((task) => task.completed != true);
    }
    if (filter === 'completed') {
      return tasks.filter((task) => task.completed == true);
    }
    return tasks;
  });

  controlS = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(4)],
  });

  changeHandler() {
    if (this.controlS.valid) {
      let task = this.controlS.value;
      this.addTask(task);

      this.controlS.setValue('');
    }
  }

  handleAdd(event: Event) {
    let input = event.target as HTMLInputElement;
    let newValue = input.value;

    this.addTask(newValue);
  }

  addTask(title: string) {
    let newId = Date.now();

    let newTask = {
      id: newId,
      task: title,
      completed: false,
    };

    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  deleteTask(id: number) {
    if (id != -1) {
      this.tasks.update((tasks) => tasks.filter((task) => task.id != id));
    }
  }

  updateTask(index: number) {
    if (index == -1) return;
    this.tasks.update((tasks) => {
      let updatedTasks = [...tasks];

      updatedTasks[index] = {
        ...updatedTasks[index],
        completed: !updatedTasks[index].completed,
      };
      return updatedTasks;
    });
  }

  updateTaskEdit(index: number) {
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position == index) {
          return {
            ...task,
            editing: true,
          };
        }
        return {
          ...task,
          editing: false,
        };
      });
    });
  }

  updateTaskTitle(index: number, event: Event) {
    let input = event.target as HTMLInputElement;
    let newValue = input.value;

    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position == index) {
          return {
            ...task,
            task: newValue,
            editing: false,
          };
        }
        return {
          ...task,
          editing: false,
        };
      });
    });
  }

  changeFilter(value: 'all' | 'pending' | 'completed') {
    this.filter.set(value);
  }
}
